import TraceConfig, {
  createDefaultConfig,
  CONTINUA_PER_FEATURE,
  NUM_FEATURES,
} from './trace-param';
import TracePhones from './trace-phones';
import * as util from './util';
import { applyRestScaling } from './response-probability';
import { ModelInputError } from './errors';

export default class TraceNet {
  private config: TraceConfig;
  public phonemes: TracePhones;

  private lengthNormalizationScale!: number;

  public inputLayer!: number[][];
  public featLayer!: number[][];
  public featNet!: number[][];
  public phonLayer!: number[][];
  public phonNet!: number[][];
  public wordLayer!: number[][];
  public wordNet!: number[][];

  public globalFeatureCompetitionIndex = 0;
  public globalLexicalCompetitionIndex = 0;
  public globalPhonemeCompetitionIndex = 0;
  public globalPhonToWordSum = 0;
  public globalWordToPhonSum = 0;
  public globalFeatToPhonSum = 0;
  public globalPhonToFeatSum = 0;
  public globalFeatSumAll = 0;
  public globalFeatSumPos = 0;
  public globalPhonSumAll = 0;
  public globalPhonSumPos = 0;
  public globalWordSumAll = 0;
  public globalWordSumPos = 0;

  private pww!: number[][];
  private wpw!: number[][];
  private fpw!: number[][][];
  private pfw!: number[][][];

  private inputSlice: number = 0;
  private __nreps: number = 1;

  constructor(config: TraceConfig = createDefaultConfig()) {
    this.config = config;
    this.phonemes = new TracePhones(this.config.phonology);
    this.reset();
  }

  public reset() {
    //length_normalization_fulcrum=4.5;
    // a clever way to guess the optimal 'fulcrum' of length normalization
    this.lengthNormalizationScale = 1 / util.average(this.config.lexicon.map((x) => x.phon.length));
    //System.out.println("length_normalization_scale:"+length_normalization_scale)
    this.inputSlice = 0;

    this.inputLayer = util.zeros2D(CONTINUA_PER_FEATURE * NUM_FEATURES, this.config.fSlices);
    this.featLayer = util.zeros2D(CONTINUA_PER_FEATURE * NUM_FEATURES, this.config.fSlices);
    this.featNet = util.zeros2D(CONTINUA_PER_FEATURE * NUM_FEATURES, this.config.fSlices);
    this.phonLayer = util.zeros2D(this.config.phonology.length, this.getPSlices());
    this.phonNet = util.zeros2D(this.config.phonology.length, this.getPSlices());
    this.wordLayer = util.zeros2D(this.config.lexicon.length, this.getPSlices());
    this.wordNet = util.zeros2D(this.config.lexicon.length, this.getPSlices());

    this.pww = util.zeros2D(this.config.phonology.length, 4);
    this.wpw = util.zeros2D(this.config.phonology.length, 4);
    this.fpw = util.zeros3D(this.config.phonology.length, CONTINUA_PER_FEATURE, 0);
    this.pfw = util.zeros3D(this.config.phonology.length, CONTINUA_PER_FEATURE, 0);

    for (let p = 0; p < this.config.phonology.length; p++) {
      for (let c = 0; c < CONTINUA_PER_FEATURE; c++) {
        this.fpw[p][c] = Array(this.config.spread[c] * 2).fill(0);
        this.pfw[p][c] = Array(this.config.spread[c] * 2).fill(0);
      }
    }

    // if there is a phoneme continuum defined in the parameters, create it here.
    if (this.config.continuumSpec && this.config.continuumSpec.trim().length == 3) {
      const step = +this.config.continuumSpec.trim()[2];
      if (step > 1 && step < 10) {
        this.phonemes.makePhonemeContinuum(
          this.config.continuumSpec.trim()[0],
          this.config.continuumSpec.trim()[1],
          step
        );
      }
    }

    this.phonemes.spreadPhons(
      this.config.spread,
      this.config.spreadScale,
      this.config.min,
      this.config.max
    );

    // init feature layer to resting value
    let rest = this.clamp(this.config.rest.F || 0);
    for (let fslice = 0; fslice < this.config.fSlices; fslice++) {
      for (let feat = 0; feat < CONTINUA_PER_FEATURE * NUM_FEATURES; feat++) {
        this.featLayer[feat][fslice] = rest;
      }
    }

    // init phon layer to resting value
    rest = this.clamp(this.config.rest.P || 0);
    for (let slice = 0; slice < this.getPSlices(); slice++) {
      for (let phon = 0; phon < this.config.phonology.length; phon++) {
        this.phonLayer[phon][slice] = rest;
      }
    }

    // init word layer to resting value
    // Original frequency implementation from cTRACE is being dropped:
    //  wp->base = rest[W] + fscale*log(1. + wordfreq[i]);
    rest = this.clamp(this.config.rest.W || 0);
    for (let wslice = 0; wslice < this.getWSlices(); wslice++) {
      for (let word = 0; word < this.config.lexicon.length; word++) {
        this.wordLayer[word][wslice] = rest;
      }
    }

    // frequency applied to the resting level of lexical items
    if (this.config.freqNode.RDL_rest_s) {
      for (let wslice = 0; wslice < this.getWSlices(); wslice++) {
        for (let word = 0; word < this.config.lexicon.length; word++) {
          this.wordLayer[word][wslice] += applyRestScaling(
            this.config.freqNode,
            this.config.lexicon[word].freq
          );
        }
      }
    }

    //priming applied to the resting level of lexical items
    if (this.config.primeNode.RDL_rest_s) {
      for (let wslice = 0; wslice < this.getWSlices(); wslice++)
        for (let word = 0; word < this.config.lexicon.length; word++) {
          if (this.config.lexicon[word].prime > 0)
            this.wordLayer[word][wslice] += applyRestScaling(
              this.config.primeNode,
              this.config.lexicon[word].prime
            );
        }
    }

    // from C code: tdur = (float)(PWIDTH + POVERLAP)*pp->wscale/FPP = (((6+6)*1)/3)=4
    const tdur = 4;
    this.__nreps = this.config.nreps;
    if (this.__nreps <= 0) this.__nreps = 1;

    // calculate the pww and wpw arrays.
    // how much can a phoneme at slice 4 activate a word at slice 5?
    // the pww array contains scalars stating how much to scale down per offset slices.
    // the wpw array is the same idea, except for w->p connections.
    for (let phon = 0; phon < this.config.phonology.length; phon++) {
      let denom = 0;
      for (let pslice = 0; pslice <= 4; pslice++) {
        const ft = (tdur - Math.abs(2 - pslice)) / tdur;
        denom += ft * ft;
      }
      for (let pslice = 0; pslice < 4; pslice++) {
        const ft = (tdur - Math.abs(2 - pslice)) / tdur;
        this.pww[phon][pslice] = ft / denom;
        this.wpw[phon][pslice] = (1 * ft) / denom;
      }
    }

    // calculate fpw, pfw
    // how much can a feature influence a phoneme if there are mis-aligned.
    // these arrays state how much to scale down per offset slice.
    for (let phon = 0; phon < this.config.phonology.length; phon++) {
      for (let cont = 0; cont < CONTINUA_PER_FEATURE; cont++) {
        let denom = 0;
        const spr = this.config.spread[cont] * 1; // 1 is stand in for pp->wscale (?)
        const ispr = Math.floor(spr);
        for (let fslice = 0; fslice < 2 * ispr; fslice++) {
          const ft = (spr - Math.abs(ispr - fslice)) / spr;
          denom += ft * ft;
        }
        for (let fslice = 0; fslice < 2 * ispr; fslice++) {
          this.pfw[phon][cont][fslice] = (spr - Math.abs(ispr - fslice)) / spr;
          this.fpw[phon][cont][fslice] = this.pfw[phon][cont][fslice] / denom;
        }
      }
    }

    // create input
    this.createInput();
  }

  private getPSlices(): number {
    return Math.floor(this.config.fSlices / this.config.slicesPerPhon);
  }

  private getWSlices(): number {
    return this.getPSlices();
  }

  private clamp(n: number): number {
    return util.clamp(n, this.config.min, this.config.max);
  }

  /**
   * Create the input layer
   *  loop through all the phonemes, and copy the corresponding features to it.
   *  the offset for the phoneme should be used inorder to center
   * Variables which have been left out from original trace, M&E did not use them:
   *  WEIGHTp(i),c,fs   STRENGTHp(i)   PEAKp(i)   SUSp(i)   RATEp(i)
   * converts the model input into a pseudo-spectral input representation, store in inputLayer
   */
  public createInput() {
    const phons = this.config.modelInput.trim();

    // store the target
    /*if (phons == '-') {
      inputString = phons
    } else {
      inputString = phons.split('-', 1)[0] || '---'
    }*/

    // create the input layer.
    // loop over phoneme input. go to next phoneme and step 6 slices. until the end of the input is reached or
    // FSLICES is reached
    let slice = this.config.deltaInput;
    for (let i = 0; i < phons.length && slice < this.config.fSlices; i++) {
      // if we encounter a 'splice' phone, proceed accordingly
      if (phons[i] == '{') {
        const p1 = this.phonemes.byLabel(phons[++i]);
        const splicePoint: number = +phons[++i];
        const p2 = this.phonemes.byLabel(phons[++i]);
        i += 1; // skip the } character

        if (!p1 || !p2 || !p1.spread || !p1.spreadOffset || !p2.spread || !p2.spreadOffset) {
          throw new ModelInputError();
        }

        // first half of the spliced phoneme
        const inputOffset = slice - p1.spreadOffset;
        for (
          let t = inputOffset, phonOffset = 0;
          t < inputOffset + splicePoint;
          t++, phonOffset++
        ) {
          for (let cont = 0; cont < NUM_FEATURES * CONTINUA_PER_FEATURE; cont++) {
            if (t >= 0 && t < this.config.fSlices) {
              this.inputLayer[cont][t] += p1.spread[cont][phonOffset];
            }
          }
        }

        // second half of the spliced phoneme
        for (
          let t = inputOffset + splicePoint, phonOffset = splicePoint;
          t < inputOffset + p2.spreadOffset * 2;
          t++, phonOffset++
        ) {
          for (let cont = 0; cont < NUM_FEATURES * CONTINUA_PER_FEATURE; cont++) {
            if (t >= 0 && t < this.config.fSlices) {
              this.inputLayer[cont][t] += p2.spread[cont][phonOffset];
            }
          }
        }

        slice += this.config.deltaInput;
      } else {
        // otherwise, we are dealing with a normal, or ambiguous phoneme input.
        const phon = this.phonemes.byLabel(phons[i]);

        if (!phon || !phon.spread || !phon.spreadOffset) {
          throw new ModelInputError();
        }

        //System.out.println("phon->char "+phons.charAt(i+syntactic_incr)+"->"+phon);
        const inputOffset = slice - Math.round(phon.spreadOffset);
        // copy the spread phonemes onto the input layer (aligned correctly)
        for (
          let t = inputOffset, phonOffset = 0;
          t < inputOffset + Math.round(phon.spreadOffset * 2);
          t++, phonOffset++
        ) {
          for (let cont = 0; cont < NUM_FEATURES * CONTINUA_PER_FEATURE; cont++) {
            if (t >= 0 && t < this.config.fSlices) {
              this.inputLayer[cont][t] += phon.spread[cont][phonOffset];
            }
          }
        }
        // duration scaling!
        slice += Math.round(this.config.deltaInput * phon.durationScalar[0]);
      }
    }

    // apply input noise here.
    if (this.config.noiseSD != 0) {
      for (let feat = 0; feat < NUM_FEATURES * CONTINUA_PER_FEATURE; feat++) {
        for (let islice = 0; islice < this.config.fSlices; islice++) {
          this.inputLayer[feat][islice] += util.gauss(0.0, this.config.noiseSD);
        }
      }
    }

    // apply clamping
    for (let feat = 0; feat < NUM_FEATURES * CONTINUA_PER_FEATURE; feat++) {
      for (let islice = 0; islice < this.config.fSlices; islice++) {
        this.inputLayer[feat][islice] = this.clamp(this.inputLayer[feat][islice]);
      }
    }

    // the next line copies one column of data, forcing the _feature layer_ to undergo one cycle immediately.
    // this compensates for a discrepency between jTrace and cTrace; keeps things lined up.
    for (let c = 0; c < CONTINUA_PER_FEATURE; c++) {
      for (let f = 0; f < NUM_FEATURES; f++) {
        this.featNet[c * NUM_FEATURES + f][0] += this.inputLayer[c * NUM_FEATURES + f][0];
      }
    }
    this.featUpdate();
  }

  // variable names taken from cTRACE.
  // input-to-feature activation, AND feature-to-feature inhibition.
  private actFeatures() {
    this.globalFeatureCompetitionIndex = 0;
    // computes total inhibition coming from a continuum to each node at that time slice
    // sum of prev slice's positive activations summed over each continuum at each fslice
    const fsum: number[][] = util.zeros2D(CONTINUA_PER_FEATURE, this.config.fSlices);
    for (let c = 0; c < CONTINUA_PER_FEATURE; c++)
      for (let f = 0; f < NUM_FEATURES; f++)
        for (let fslice = 0; fslice < this.config.fSlices; fslice++)
          if (this.featLayer[c * NUM_FEATURES + f][fslice] > 0)
            fsum[c][fslice] += this.featLayer[c * NUM_FEATURES + f][fslice];

    // this block scales down the fsum value by Gamma.F
    //ff=[c][i]=fsum[c][i]*Gamma.F
    const ffi = fsum.map((row) => row.map((node) => node * (this.config.gamma.F || 0)));
    /*const ffi: number[][] = util.zeros2D(CONTINUA_PER_FEATURE, this.config.fSlices)
    for (let c = 0; c < CONTINUA_PER_FEATURE; c++)
      for (let fslice = 0; fslice < this.config.fSlices; fslice++)
        ffi[c][fslice] = fsum[c][fslice] * this.config.gamma.F*/

    // this block copies input activations to the feature layer
    if (this.inputSlice < this.config.fSlices) {
      for (let fIndex = 0; fIndex < CONTINUA_PER_FEATURE * NUM_FEATURES; fIndex++) {
        for (
          let fslice = this.inputSlice + 1;
          fslice < this.config.fSlices && fslice < this.inputSlice + 1 + this.__nreps;
          fslice++
        ) {
          //small variation from original
          //input->feature activation
          const n = this.clamp((this.config.alpha.IF || 0) * this.inputLayer[fIndex][fslice]);
          this.featNet[fIndex][fslice] += n;
          this.globalFeatureCompetitionIndex -= n;
        }
      }
    }

    // this block applies ffi inhibition to each node in the featue layer, and compensates for self-inhibition
    for (let c = 0; c < CONTINUA_PER_FEATURE; c++) {
      for (let f = 0; f < NUM_FEATURES; f++) {
        for (let fslice = 0; fslice < this.config.fSlices; fslice++) {
          const n = Math.max(
            0,
            ffi[c][fslice] -
              Math.max(0, this.featLayer[c * NUM_FEATURES + f][fslice] * (this.config.gamma.F || 0))
          );
          this.featNet[c * NUM_FEATURES + f][fslice] -= n;
          this.globalFeatureCompetitionIndex += n;
        }
      }
    }
  }

  /**
   * Feature to phoneme activations
   */
  private featToPhon() {
    const FPP = this.config.slicesPerPhon;
    const pSlices = this.getPSlices();
    this.globalFeatToPhonSum = 0;
    // for every feature at every slice, if the units activation is above zero,
    // then send activation to phonNet from the featLayer scaled by PhonDefs,
    // spread, fwp and alpha.
    for (let featIndex = 0; featIndex < CONTINUA_PER_FEATURE * NUM_FEATURES; featIndex++) {
      for (let fslice = 0; fslice < this.config.fSlices; fslice++) {
        if (this.featLayer[featIndex][fslice] > 0) {
          // for all phonemes affected by the current feature.
          // C code appears to ignore the first phoneme affected by feat (why?)
          for (const [idx, phone] of this.phonemes.sorted().entries()) {
            if (phone.features[featIndex] == 0) {
              continue;
            }

            // determine, based on current slice and spread, what range of
            // phoneme units to send activation to.
            const fspr = this.config.spread[Math.floor(featIndex / NUM_FEATURES)];
            const fmax = this.config.fSlices - fspr;
            let pstart, pend;
            if (fslice < fspr) {
              pstart = 0;
              pend = Math.floor((fslice + fspr - 1) / FPP);
            } else {
              if (fslice > fmax) pend = pSlices - 1;
              else pend = Math.floor((fslice + fspr - 1) / FPP);
              pstart = Math.floor((fslice - fspr) / FPP + 1);
            }
            let winstart = fspr - (fslice - FPP * pstart);

            // include only positive acoustic evidence
            let t = 0;
            if (this.featLayer[featIndex][fslice] > 0) {
              t =
                phone.features[featIndex] *
                this.featLayer[featIndex][fslice] *
                (this.config.alpha.FP || 0);
            }

            const c = Math.floor(featIndex / NUM_FEATURES);
            for (let pslice = pstart; pslice < pend + 1 && pslice < pSlices; pslice++) {
              //System.out.println(phon+"\t"+pslice+"\t"+phon+"\t"+c+"\t"+winstart);
              const n = this.fpw[idx][c][winstart] * t;
              this.phonNet[idx][pslice] += n;
              this.globalFeatToPhonSum += n;
              //winstart+=3; //changing this hard-coded line...
              winstart += FPP; //to this.  (seems to work 04/19/2007)
            }
          }
        }
      }
    }
  }

  /** calculate inhibitions in phoneme layer **/
  public phonToPhon() {
    const pSlices = this.getPSlices();
    let ppi = Array(pSlices).fill(0);
    let pmax = 0,
      pmin = 0;
    let halfdur = 1;

    // the ppi accumulates all of the inhibition at a particular phoneme slice.
    // this amount of inhibition is later applied equally to all phonemes.
    for (let slice = 0; slice < pSlices; slice++) {
      for (let phon = 0; phon < this.config.phonology.length; phon++) {
        // if the phon unit has activation, determine its extent (does it hit an edge?) ...
        if (this.phonLayer[phon][slice] > 0) {
          pmax = slice + halfdur;
          if (pmax >= pSlices) {
            pmax = pSlices - 1;
            pmin = slice - halfdur;
          } else {
            pmin = slice - halfdur;
            if (pmin < 0) pmin = 0;
          }
          // then add its activation to ppi, scaled by gamma.
          for (let i = pmin; i < pmax; i++)
            ppi[i] += this.phonLayer[phon][slice] * (this.config.gamma.P || 0);
        }
      }
    }
    // now, determine again the extent of each phoneme unit,
    // then apply inhibition equally to phons lying on the same phon slice.
    this.globalPhonemeCompetitionIndex = 0;
    for (let phon = 0; phon < this.config.phonology.length; phon++) {
      //loop over phonemes
      for (let slice = 0; slice < pSlices; slice++) {
        // loop over phoneme slices (original configuration 33)
        pmax = slice + halfdur;
        if (pmax >= pSlices) {
          pmax = pSlices - 1;
          pmin = slice - halfdur;
        } else {
          pmin = slice - halfdur;
          if (pmin < 0) pmin = 0;
        }
        for (let i = pmin; i < pmax; i++) {
          // application of inhibition occurs here
          if (ppi[i] > 0) {
            this.phonNet[phon][slice] -= ppi[i];
            this.globalPhonemeCompetitionIndex += ppi[i];
          }
        }
        // here, we make up for self-inhibition, reimbursing nodes for inhibition that
        // originated from themselves.
        if (this.phonLayer[phon][slice] * (this.config.gamma.P || 0) > 0 && ppi[slice] > 0) {
          const n = (pmax - pmin) * this.phonLayer[phon][slice] * (this.config.gamma.P || 0);
          this.phonNet[phon][slice] += n;
          this.globalPhonemeCompetitionIndex -= n;
        }
        // here, we make up for allophone-inhibition, reimbursing nodes for inhibition
        // that originate from allophones of the target, as defined in the allophon matrix.
        // note that this is an experimental feature of jtrace, implemented by tjs, 07/19/2007.
        for (let allophone = 0; allophone < this.config.phonology.length; allophone++) {
          // loop over phonemes
          // TODO:
          //if (tp.getPhonology().getAllophoneRelation(phon, allophone)) {
          //  phonNet[phon][slice] += ((pmax - pmin) * phonLayer[allophone][slice]) * tp.getGamma().P;
          //}
        }
      }
    }
  }

  public phonToFeat() {
    const fSlices = this.config.fSlices;
    const fpp = this.config.slicesPerPhon;
    this.globalPhonToFeatSum = 0;
    for (let fslice = 0; fslice < fSlices; fslice++) {
      for (let cont = 0; cont < CONTINUA_PER_FEATURE; cont++) {
        //loop over all continua (7)
        for (let feat = 0; feat < NUM_FEATURES; feat++) {
          let activation = 0; //activation is basically <PFEXp,ps,c,f,fs>
          for (let phon = 0; phon < this.config.phonology.length; phon++) {
            // loop over phonemes
            for (let pslice = 0; pslice < this.getPSlices(); pslice++) {
              // loop over phoneme slices (original configuration 33)
              let d = Math.floor(Math.abs(pslice * fpp - fslice));
              if (d >= fSlices) d = fSlices - 1;
              if (this.phonLayer[phon][pslice] > 0)
                //aLPHA connections=only excitatory
                activation +=
                  this.pfw[phon][cont][d] *
                  this.phonLayer[phon][pslice] *
                  (this.phonemes.byIndex(phon)?.features[cont * NUM_FEATURES + feat] || 0);
            }
          }
          const n = (this.config.alpha.PF || 0) * activation;
          this.featNet[cont * NUM_FEATURES + feat][fslice] += n;
          this.globalPhonToFeatSum += n;
        }
      }
    }
  }

  //lexical to phoneme feedback.
  public wordToPhon() {
    // initialize variables
    let dict = this.config.lexicon;
    let str: string;
    let wslot: number, pmin: number, pwin: number, pmax: number;
    const pSlices = this.getPSlices();
    this.globalWordToPhonSum = 0;
    // for every word in the lexicon
    for (let word = 0; word < dict.length; word++) {
      // for each word slice
      for (let wslice = 0; wslice < this.getWSlices(); wslice++) {
        // if the word has activation above zero
        if (this.wordLayer[word][wslice] <= 0) continue;
        // determine what range of slices (for that word unit) can be
        // fed back to the phoneme layer.
        str = dict[word].phon;
        for (let wstart = 0; wstart < str.length; wstart++) {
          let currPhon = this.phonemes.byLabel(str[wstart]);
          wslot = wslice + wstart * 2;
          pmin = wslot - 1; //??
          if (pmin >= pSlices) break;
          if (pmin < 0) {
            pwin = 1 - pmin;
            pmin = 0;
            pmax = wslot + 2; //from +2
          } else {
            pmax = wslot + 2; //from +2
            if (pmax > pSlices - 1) pmax = pSlices - 1;
            pwin = 1;
          }

          //now that we know the range to iterator over, iterate over the appropriate phoneme slices
          for (let pslice = pmin; pslice < pmax && pslice < pSlices && pwin < 4; pslice++, pwin++) {
            //this check makes sure that ambiguous phonemes do not feedback
            // jTRACE implements this as "currChar > pd.NPHONS && currChar < 0" which is always false??
            /*if (currPhon.phonologicalRole == TracePhoneRole.AMBIG) {
              const contIdx = +this.config.continuumSpec[2]
              if (currChar == 50) { //this is the bottom of the continuum.
                currChar = pd.mapPhon(tp.getContinuumSpec().toCharArray()[0]);
              } else if (currChar == (50 + contIdx - 1)) { //this is the top of the continuum
                currChar = pd.mapPhon(tp.getContinuumSpec().toCharArray()[2]);
              } else { //in the middle of the continuum
                //feedback will not be accumulated for any ambiguous phonemes representations
                break;
              }
            }*/

            // if the current word activation is above zero
            if (this.wordLayer[word][wslice] > 0) {
              //if lexical frequency is in effect.
              //if(tp.getFreqNode().RDL_wt_s!=0&&dict.get(word).getFrequency()>0){
              let wfrq = 0;
              if (dict[word].freq && this.config.freqNode.RDL_wt_s)
                wfrq = this.config.freqNode.RDL_wt_s * Math.log10(dict[word].freq);
              let wprim = 0;
              if (dict[word].prime && this.config.primeNode.RDL_wt_s)
                wprim = this.config.primeNode.RDL_wt_s * Math.log10(dict[word].prime);

              // scale the activation by alpha and wpw
              const n =
                (1 + wfrq + wprim) *
                this.wordLayer[word][wslice] *
                (this.config.alpha.WP || 0) *
                this.wpw[currPhon!.index!][pwin];
              this.phonNet[currPhon!.index!][pslice] += n;
              this.globalWordToPhonSum += n;
            }
          }
        }
      }
    }
  }

  //This implementation actually depends on pdur being 2, re: pww dynamics.
  public phonToWord() {
    const dict = this.config.lexicon;
    const pSlices = this.getPSlices();
    let wpeak, wmin, winstart, wmax, pdur, strlen;
    this.globalPhonToWordSum = 0;
    // for each phoneme
    for (let phon = 0; phon < this.config.phonology.length; phon++) {
      pdur = 2;

      //hack
      if (this.config.deltaInput != 6 || this.config.slicesPerPhon != 3)
        pdur = Math.floor(this.config.deltaInput / this.config.slicesPerPhon);
      //end hack

      // and for each phoneme slice
      for (let pslice = 0; pslice < pSlices; pslice++) {
        // if the current unit is below zero, skip it.
        if (this.phonLayer[phon][pslice] <= 0) continue;
        // iterate over each word in the dictionary
        words: for (let word = 0; word < dict.length; word++) {
          const str = dict[word].phon;
          strlen = str.length;
          //for each letter in the current word
          for (let offset = 0; offset < strlen; offset++) {
            //if that letter corresponds to the phoneme we're now considering...
            if (str.charAt(offset) == this.phonemes.byIndex(phon)!.label.charAt(0)) {
              //then determine the temporal range of word units for which it
              //makes sense that the current phoneme should send activation to it.
              wpeak = pslice - pdur * offset;
              if (wpeak < -pdur) continue words;
              wmin = 1 + wpeak - pdur;
              if (wmin < 0) {
                winstart = 1 - wmin;
                wmin = 0;
                wmax = wpeak + pdur;
              } else {
                wmax = wpeak + pdur;
                if (wmax > pSlices - 1) wmax = pSlices - 1;
                winstart = 1;
              }
              //determine the raw amount of activation that is sent to the word units
              let t = 2 * this.phonLayer[phon][pslice] * (this.config.alpha.PW || 0); //cTRACE: the 2 stands for word->scale

              let wfrq = 0;
              if (this.config.freqNode.RDL_wt_s && dict[word].freq) {
                wfrq = this.config.freqNode.RDL_wt_s * Math.log10(dict[word].freq);
              }
              let wprm = 0;
              if (this.config.primeNode.RDL_wt_s && dict[word].prime) {
                wprm = this.config.primeNode.RDL_wt_s * Math.log10(dict[word].prime);
                //t = tp.getPrimeNode().applyWeightPrimeScaling(tp.getLexicon().get(word), t);
              }

              //now iterate over the temporal range determined about 15 lines above
              for (
                let wslice = wmin;
                wslice < wmax && wslice < this.getWSlices();
                wslice++, winstart++
              ) {
                if (winstart >= 0 && winstart < 4) {
                  //scale activation by pww; this determines how temporal offset should affect excitation
                  const n = (1 + wfrq + wprm) * this.pww[phon][winstart] * t;
                  this.wordNet[word][wslice] += n;
                  this.globalPhonToWordSum += n;
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * word to word inhibition: operates the same as phoneme inhibition -- calculate
   * the total amount of inhibition at each slice and apply that equally to all words
   * that overlap with that slice somewhere.  this means that word length increases
   * the amount of lexical inhibition linearly.
   */
  public wordToWord() {
    const pSlices = this.getPSlices();
    const wwi = Array(pSlices).fill(0);
    const wisum = Array(pSlices).fill(0);
    const dict = this.config.lexicon;
    // for all word slices
    for (let wstart = 0; wstart < pSlices; wstart++) {
      // for all words
      for (let word = 0; word < dict.length; word++) {
        // determine how many slices the current word lies on
        let wmin = wstart; //wstart - (1/2 phone width))
        if (wmin < 0) wmin = 0;
        let wmax = wstart + dict[word].phon.length * 2; //!! wstart + (wlength*phone width) + (1/2 phone width)
        if (wmax > pSlices) wmax = pSlices - 1;
        for (let l = wmin; l < wmax; l++) {
          // then add that word unit's activation to the wisum array,
          if (this.wordLayer[word][wstart] > 0) {
            wisum[l] += this.wordLayer[word][wstart] * this.wordLayer[word][wstart];
          }
        }
      }
    }
    // next, scale the wisum array by gamma, and it is now called the wwi array.
    // there is also a built-in ceiling here, preventing inhibition over 3.0d.
    for (let wstart = 0; wstart < pSlices; wstart++) {
      if (wisum[wstart] > 3.0) wisum[wstart] = 3.0;
      wwi[wstart] = wisum[wstart] * (this.config.gamma.W || 0);
    }
    // now, repeat the looping over words and slices and apply the inhibition
    // accumulated at each slice to every word unit that overlaps with that slice.
    this.globalLexicalCompetitionIndex = 0;
    for (let wstart = 0; wstart < pSlices; wstart++) {
      for (let word = 0; word < dict.length; word++) {
        let wmin = wstart; //wstart - (1/2 phone width))
        if (wmin < 0) wmin = 0;
        let wmax = wstart + dict[word].phon.length * 2; //!! wstart + (wlength*phone width) + (1/2 phone width)
        if (wmax > pSlices) wmax = pSlices - 1;

        // length_normalization_scale = 1/(14  -dict.get(word).getPhon().length());
        // inhibition applied in this loop.
        for (let l = wmin; l < wmax; l++) {
          // EXTENSION
          if (this.config.lengthNormalization) {
            let compensation_factor = 1 / (dict[word].phon.length * this.lengthNormalizationScale);
            if (compensation_factor > 1) compensation_factor = 1;
            //double compensation_factor = (((dict.get(word).getPhon().length() / length_normalization_fulcrum ) - 1) * length_normalization_scale) + 1
            //if(compensation_factor<0) compensation_factor=1;
            const n = wwi[l] * compensation_factor;
            this.wordNet[word][wstart] -= n; //if(wwi[l]>0) //inhibition applied here
            this.globalLexicalCompetitionIndex += n;
          }
          //END EXTENSION
          else {
            this.wordNet[word][wstart] -= wwi[l]; //if(wwi[l]>0) //inhibition applied here
            this.globalLexicalCompetitionIndex += wwi[l];
          }
        }
        // re-imbursement of self-inhibition occurs here.
        if (this.wordLayer[word][wstart] > 0) {
          //self-inhibitiopn prevented here.
          // EXTENSION
          if (this.config.lengthNormalization) {
            let compensation_factor = 1 / (dict[word].phon.length * this.lengthNormalizationScale);
            if (compensation_factor > 1) compensation_factor = 1;
            const n =
              (wmax - wmin) *
              (this.wordLayer[word][wstart] * this.wordLayer[word][wstart] * (this.config.gamma.W || 0)) *
              compensation_factor;
            this.wordNet[word][wstart] += n;
            this.globalLexicalCompetitionIndex -= n;
          }
          //END EXTENSION
          else {
            const n =
              (wmax - wmin) *
              (this.wordLayer[word][wstart] * this.wordLayer[word][wstart] * (this.config.gamma.W || 0));
            this.wordNet[word][wstart] += n;
            this.globalLexicalCompetitionIndex -= n;
          }
        }
      }
    }
  }

  /**
   * final processing of feature units incorporates stochasticity (if on) and
   * implements decay to resting level behavior.
   */
  public featUpdate() {
    const { min, max } = this.config;
    this.globalFeatSumAll = 0;
    this.globalFeatSumPos = 0;
    for (let slice = 0; slice < this.config.fSlices; slice++) {
      for (let feat = 0; feat < NUM_FEATURES * CONTINUA_PER_FEATURE; feat++) {
        if (this.config.stochasticitySD) {
          //apply gaussian noise here
          this.featNet[feat][slice] += util.gauss(0.0, this.config.stochasticitySD); //this adds the noise
        }

        let t = this.featLayer[feat][slice];
        if (this.featNet[feat][slice] > 0) t += (max - t) * this.featNet[feat][slice];
        else if (this.featNet[feat][slice] < 0) t += (t - min) * this.featNet[feat][slice];
        let tt = this.featLayer[feat][slice] - (this.config.rest.F || 0);
        //if(t!=0)
        t -= (this.config.decay.F || 0) * tt;
        if (t > max) t = max;
        if (t < min) t = min;
        //final update for feature layer
        this.featLayer[feat][slice] = t;
        this.globalFeatSumAll += t;
        if (t > 0) {
          this.globalFeatSumPos += t;
        }
      }
    }
    this.featNet = util.zeros2D(NUM_FEATURES * CONTINUA_PER_FEATURE, this.config.fSlices);
  }

  /**
   * final processing of phoneme units incorporates stochasticity (if on) and
   * implements decay to resting level behavior.
   */
  public phonUpdate() {
    const pSlices = this.getPSlices();
    this.globalPhonSumAll = 0;
    this.globalPhonSumPos = 0;
    for (let pslice = 0; pslice < pSlices; pslice++) {
      for (let phon = 0; phon < this.config.phonology.length; phon++) {
        if (this.config.stochasticitySD) {
          //apply gaussian noise here
          this.phonNet[phon][pslice] += util.gauss(0.0, this.config.stochasticitySD); // this adds the noise
        }

        let diff;
        if (this.phonNet[phon][pslice] >= 0) diff = this.config.max - this.phonLayer[phon][pslice];
        else diff = this.phonLayer[phon][pslice] - this.config.min;

        const rest = this.phonLayer[phon][pslice] - (this.config.rest.P || 0);

        // final update for phoneme layer
        this.phonLayer[phon][pslice] +=
          diff * this.phonNet[phon][pslice] - (this.config.decay.P || 0) * rest;
        this.phonLayer[phon][pslice] = this.clamp(this.phonLayer[phon][pslice]);
        this.globalPhonSumAll += this.phonLayer[phon][pslice];
        if (this.phonLayer[phon][pslice] > 0) {
          this.globalPhonSumPos += this.phonLayer[phon][pslice];
        }
      }
    }
    this.phonNet = util.zeros2D(this.config.phonology.length, pSlices);
  }

  /**
   * final processing of word units incorporates stochasticity (if on) and
   * implements decay to resting level behavior.
   */
  public wordUpdate() {
    const wSlices = this.getWSlices();
    const { min, max } = this.config;
    this.globalWordSumAll = 0;
    this.globalWordSumPos = 0;
    for (let word = 0; word < this.config.lexicon.length; word++) {
      for (let slice = 0; slice < wSlices; slice++) {
        // apply attention modulation (cf. Mirman et al., 2005)
        this.wordNet[word][slice] *= this.config.atten;
        this.wordNet[word][slice] -= this.config.bias;

        if (this.config.stochasticitySD) {
          // apply gaussian noise here
          this.wordNet[word][slice] += util.gauss(0.0, this.config.stochasticitySD); // this adds the noise
        }

        let t = this.wordLayer[word][slice];
        if (this.wordNet[word][slice] > 0) t += (max - t) * this.wordNet[word][slice];
        else if (this.wordNet[word][slice] < 0) t += (t - min) * this.wordNet[word][slice];
        // resting prime & resting freq effects
        let tt;
        if (
          this.config.freqNode.RDL_rest_s &&
          this.config.lexicon[word].freq > 0 &&
          this.config.primeNode.RDL_rest_s &&
          this.config.lexicon[word].prime > 0
        )
          tt =
            this.wordLayer[word][slice] -
            ((this.config.rest.W || 0) +
              applyRestScaling(this.config.freqNode, this.config.lexicon[word].freq)) +
            ((this.config.rest.W || 0) +
              applyRestScaling(this.config.primeNode, this.config.lexicon[word].prime));
        //resting freq effects
        else if (this.config.freqNode.RDL_rest_s && this.config.lexicon[word].freq > 0)
          tt =
            this.wordLayer[word][slice] -
            ((this.config.rest.W || 0) +
              applyRestScaling(this.config.freqNode, this.config.lexicon[word].freq));
        //resting prime
        else if (this.config.primeNode.RDL_rest_s && this.config.lexicon[word].prime > 0)
          tt =
            this.wordLayer[word][slice] -
            ((this.config.rest.W || 0) +
              applyRestScaling(this.config.primeNode, this.config.lexicon[word].prime));
        //no resting prime or resting freq effects
        else tt = this.wordLayer[word][slice] - (this.config.rest.W || 0);
        //if(tt != 0)
        t -= (this.config.decay.W || 0) * tt;

        if (t > max) t = max;
        if (t < min) t = min;
        this.wordLayer[word][slice] = t;
        this.globalWordSumAll += t;
        if (t > 0) {
          this.globalWordSumPos += t;
        }
      }
    }
    this.wordNet = util.zeros2D(this.config.lexicon.length, wSlices);
  }

  public cycle() {
    this.actFeatures();

    const cycles = this.config.nreps < 0 ? Math.abs(this.config.nreps) : 1;
    for (let i = 0; i < cycles; i++) {
      this.featToPhon();
      this.phonToPhon();
      // this.phonToFeat()  //not yet implemented correctly; no one has ever been interested in this aspect.
      this.phonToWord();
      this.wordToPhon();
      this.wordToWord();
      this.featUpdate();
      this.phonUpdate();
      this.wordUpdate();
    }
    this.inputSlice += this.__nreps;
  }
}
