export enum TracePhoneRole {
  NORMAL = 1,
  AMBIG,
  ALLOPHONE,
  OTHER,
}

/**
 * POW, VOC, DIF, ACU, GRD, VOI, BR
 */
export interface TracePhone {
  label: string
  features: number[]
  durationScalar: number[]
  phonologicalRole: TracePhoneRole
}

export interface TraceWord {
  phon: string
  label?: string
  freq: number
  prime: number
  valid?: boolean
}

export interface Decay {
  F?: number
  P?: number
  W?: number
}

export interface Rest {
  F?: number
  P?: number
  W?: number
}

export interface Alpha {
  IF?: number
  FP?: number
  PW?: number
  WP?: number
  PF?: number
}

export interface Gamma {
  F?: number
  P?: number
  W?: number
}

export interface RdlNode {
  RDL_rest_s: number // = 0.06
  RDL_rest_c: number // = 1.0

  /**
   * ph->wd connection frequency effect:
   *   phoneme-to-word transmission is scaled by frequency values.
   */
  RDL_wt_s: number // = 0.13
  RDL_wt_c: number // = 1.0

  /**
   * post-perceptual frequenct effect:
   *   LCR analysis calculation scales word responce probabilities by freq values.
   */
  //RDL_post_s: number //purposely left out of specification
  RDL_post_c: number // = 15.0
}

export interface TraceAllophoneRelation {
  phon1: string
  phon2: string
}

export default interface TraceConfig {
  continuaPerFeature: number;
  numFeatures: number;
  user?: string
  dateTime?: string
  comment?: string
  modelInput: string
  spread: number[]
  spreadScale: number[]
  min: number
  max: number
  /**
   * how many cycles should trace do in each step;
   * nreps can seriously affect the rate at which perceptual affects seem to take effect
   * versus how recently the input was presented.  with a high nreps value, an input will
   * be presented but words may seem to take relatively long time to become active.
   */
  nreps: number
  /** tracenet will put a new phoneme/word unit every slicesPerPhon fslices */
  slicesPerPhon: number
  /** number of feature slices */
  fSlices: number
  /** rate at which F P W layers dacay */
  decay: Decay
  /** resting level at F P W layers. */
  rest: Rest
  /** strength of excitatory connections between following layer pairs?: IF FP PF PW WP  */
  alpha: Alpha
  /** strength of inhibitory connections at F P W layers */
  gamma: Gamma
  /** current lexicon */
  lexicon: TraceWord[]
  /*
  private TraceFunctionList functionList;*/
  /** input a new feature every deltaInput slices, similar to PEAKp(i) calculation */
  deltaInput: number
  /** amount of input noise */
  noiseSD: number
  /** amount of processing noise */
  stochasticitySD: number

  //attention, phoneme learning rate params (cf. Mirman et al. 2005)
  atten: number
  bias: number
  learningrate: number
  /** length normalization?: binary */
  lengthNormalization: number

  /** lexical frequency parameters. stores variables for three type of lexical frequency effects */
  freqNode: RdlNode
  /** priming parameters. stores variables for three type of lexical priming */
  primeNode: RdlNode
  /** ambiguous phoneme continuum parameters. three character mnemonic specify the current phoneme continuum. */
  continuumSpec: string
  phonology: TracePhone[]
  allophoneRelations: TraceAllophoneRelation[]
}

export const createDefaultPhoneme = (config: Pick<TraceConfig, 'numFeatures' | 'continuaPerFeature'> = createDefaultConfig()): TracePhone => ({
  label: '',
  features: Array(config.numFeatures * config.continuaPerFeature).fill(0),
  durationScalar: Array(config.continuaPerFeature).fill(1),
  phonologicalRole: TracePhoneRole.NORMAL,
})

/**
 * Creates a TraceConfig object with default values. Uses a function
 * instead of a const to prevent reference from getting mutated.
 */
export const createDefaultConfig = (): TraceConfig => ({
  continuaPerFeature: 7,
  numFeatures: 9,
  modelInput: '-^br^pt-',
  spread: [6, 6, 6, 6, 6, 6, 6],
  spreadScale: [1, 1, 1, 1, 1, 1, 1],
  min: -0.3,
  max: 1.0,
  nreps: 1,
  slicesPerPhon: 3,
  fSlices: 99,
  decay: {
    F: 0.01,
    P: 0.03,
    W: 0.05,
  },
  rest: {
    F: -0.1,
    P: -0.1,
    W: -0.01,
  },
  alpha: {
    IF: 1.0,
    FP: 0.02,
    PW: 0.05,
    WP: 0.03,
    PF: 0.0,
  },
  gamma: {
    F: 0.04,
    P: 0.04,
    W: 0.03,
  },
  deltaInput: 6,
  noiseSD: 0,
  stochasticitySD: 0,
  atten: 1.0,
  bias: 0.0,
  learningrate: 0.0,
  lengthNormalization: 0,
  phonology: [
    {
      label: 'p',
      features: [
        0  ,  0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0   , 0 , /* POW */
	      0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* VOC */
	      0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* DIF */
	      0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1. ,  0   , 0 , /* ACU */
	      0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* GRD */
	      0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* VOI */
	      1  ,  .2 ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
    {
      label: 'b',
      features: [
        0  ,  0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0   , 0 , /* POW */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* VOC */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* DIF */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1. ,  0   , 0 , /* ACU */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* GRD */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOI */
        .2 ,  1  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
    {
      label: 't',
      features: [
        0  ,  0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0   , 0 , /* POW */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* VOC */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* DIF */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* ACU */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* GRD */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* VOI */
        0  ,  0  ,  1  ,  .2 ,  0  ,  0  ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
    {
      label: 'd',
      features: [
        0  ,  0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0   , 0 , /* POW */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* VOC */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* DIF */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* ACU */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* GRD */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOI */
        0  ,  0  ,  .2 ,  1  ,  0  ,  0  ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
    {
      label: 'k',
      features: [
        0  ,  0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0   , 0 , /* POW */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* VOC */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1. ,  0   , 0 , /* DIF */
        0  ,  0  ,  0  , .1  , .3  ,  1. , .3  , .1   , 0 , /* ACU */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* GRD */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* VOI */
        0  ,  0  ,  0  ,  0  ,  1  ,  .2 ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
    {
      label: 'g',
      features: [
        0  ,  0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0   , 0 , /* POW */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* VOC */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1. ,  0   , 0 , /* DIF */
        0  ,  0  ,  0  , .1  , .3  ,  1. , .3  , .1   , 0 , /* ACU */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* GRD */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOI */
        0  ,  0  ,  0  ,  0  ,  .2 ,  1  ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
    {
      label: 's',
      features: [
        0  ,  0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* POW */
        0  ,  0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0   , 0 , /* VOC */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* DIF */
        1. , .3  , .1  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* ACU */
        0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0  ,  0   , 0 , /* GRD */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* VOI */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
    {
      label: 'S',
      features: [
        0  ,  0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* POW */
        0  ,  0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0   , 0 , /* VOC */
        0  ,  0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* DIF */
        0  ,  0  , .1  , .3  ,  1. , .3  , .1  ,  0   , 0 , /* ACU */
        0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0  ,  0   , 0 , /* GRD */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1.  , 0 , /* VOI */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
    {
      label: 'r',
      features: [
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* POW */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOC */
        0  ,  0  ,  0  ,  0  ,  0  ,  0. ,  .5 ,  1.  , 0 , /* DIF */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1. ,  0   , 0 , /* ACU */
        0  ,  0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0   , 0 , /* GRD */
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOI */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
    {
      label: 'l',
      features: [
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* POW */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOC */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1. ,  .5  , 0 , /* DIF */
        0  ,  0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0   , 0 , /* ACU */
        0  ,  0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0   , 0 , /* GRD */
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOI */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
    {
      label: 'a',
      features: [
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* POW */
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOC */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  1. ,  0   , 0 , /* DIF */
        0  ,  0  ,  0  ,  0  ,  0  , .1  , .3  ,  1   , 0 , /* ACU */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* GRD */
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOI */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
    {
      label: 'i',
      features: [
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* POW */
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOC */
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* DIF */
        1. , .3  , .1  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* ACU */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* GRD */
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOI */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
    {
      label: 'u',
      features: [
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* POW */
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOC */
        0  ,  0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* DIF */
        0  ,  0  ,  0  ,  0  , .1  , .3  ,  1. , .3   , 0 , /* ACU */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* GRD */
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOI */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL
    },
    {
      label: '^',
      features: [
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* POW */
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOC */
        0  ,  0  ,  0  ,  1. ,  0  ,  0  ,  0  ,  0   , 0 , /* DIF */
        0  ,  0  ,  0  ,  0  ,  0  , .1  , .3  ,  1   , 0 , /* ACU */
        0  ,  1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* GRD */
        1. ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* VOI */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0   , 0 , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
    {
      label: '-',
      features: [
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  , 0 ,  1.  , /* POW */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  , 0 ,  1.  , /* VOC */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  , 0 ,  1.  , /* DIF */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  , 0 ,  1.  , /* ACU */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  , 0 ,  1.  , /* GRD */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  , 0 ,  1.  , /* VOI */
        0  ,  0  ,  0  ,  0  ,  0  ,  0  ,  0  , 0 ,  1.  , /* BUR */
      ],
      durationScalar: [1, 1, 1, 1, 1, 1, 1],
      phonologicalRole: TracePhoneRole.NORMAL,
    },
  ],
  lexicon: [
    /*{ phon: '^br^pt', freq: 0, prime: 0 },
    { phon: '^dapt', freq: 0, prime: 0 },
    { phon: '^d^lt', freq: 0, prime: 0 },
    { phon: '^gri', freq: 0, prime: 0 },
    { phon: '^lat', freq: 0, prime: 0 },
    { phon: '^part', freq: 0, prime: 0 },
    { phon: '^pil', freq: 0, prime: 0 },
    { phon: 'ark', freq: 0, prime: 0 },
    { phon: 'ar', freq: 0, prime: 0 },
    { phon: 'art', freq: 0, prime: 0 },
    { phon: 'art^st', freq: 0, prime: 0 },
    { phon: '^slip', freq: 0, prime: 0 },
    { phon: 'bar', freq: 0, prime: 0 },
    { phon: 'bark', freq: 0, prime: 0 },
    { phon: 'bi', freq: 0, prime: 0 },
    { phon: 'bit', freq: 0, prime: 0 },
    { phon: 'bist', freq: 0, prime: 0 },
    { phon: 'blak', freq: 0, prime: 0 },
    { phon: 'bl^d', freq: 0, prime: 0 },
    { phon: 'blu', freq: 0, prime: 0 },
    { phon: '-', freq: 0, prime: 0 }*/
    { phon: '^', freq: 23248, prime: 0 },
    { phon: '^br^pt', freq: 37, prime: 0 },
    { phon: '^dapt', freq: 71, prime: 0 },
    { phon: '^d^lt', freq: 50, prime: 0 },
    { phon: '^gri', freq: 264, prime: 0 },
    { phon: '^lat', freq: 50, prime: 0 },
    { phon: '^part', freq: 57, prime: 0 },
    { phon: '^pil', freq: 108, prime: 0 },
    { phon: 'ark', freq: 50, prime: 0 },
    { phon: 'ar', freq: 4406, prime: 0 },
    { phon: 'art', freq: 274, prime: 0 },
    { phon: 'art^st', freq: 112, prime: 0 },
    { phon: '^slip', freq: 29, prime: 0 },
    { phon: 'bar', freq: 125, prime: 0 },
    { phon: 'bark', freq: 125, prime: 0 },
    { phon: 'bi', freq: 6382, prime: 0 },
    { phon: 'bit', freq: 87, prime: 0 },
    { phon: 'bist', freq: 50, prime: 0 },
    { phon: 'blak', freq: 118, prime: 0 },
    { phon: 'bl^d', freq: 122, prime: 0 },
    { phon: 'blu', freq: 143, prime: 0 },
    { phon: 'bab', freq: 45, prime: 0 },
    { phon: 'babi', freq: 23, prime: 0 },
    { phon: 'badi', freq: 341, prime: 0 },
    { phon: 'bust', freq: 23, prime: 0 },
    { phon: 'but', freq: 34, prime: 0 },
    { phon: 'bat^l', freq: 95, prime: 0 },
    { phon: 'baks', freq: 87, prime: 0 },
    { phon: 'brid', freq: 25, prime: 0 },
    { phon: 'brud', freq: 26, prime: 0 },
    { phon: 'br^S', freq: 77, prime: 0 },
    { phon: 'b^b^l', freq: 32, prime: 0 },
    { phon: 'b^k', freq: 31, prime: 0 },
    { phon: 'b^s', freq: 34, prime: 0 },
    { phon: 'b^t', freq: 4382, prime: 0 },
    { phon: 'kar', freq: 386, prime: 0 },
    { phon: 'kard', freq: 62, prime: 0 },
    { phon: 'karp^t', freq: 22, prime: 0 },
    { phon: 'sis', freq: 34, prime: 0 },
    { phon: 'klak', freq: 30, prime: 0 },
    { phon: 'kl^b', freq: 171, prime: 0 },
    { phon: 'klu', freq: 25, prime: 0 },
    { phon: 'kalig', freq: 32, prime: 0 },
    { phon: 'kul', freq: 149, prime: 0 },
    { phon: 'kap', freq: 32, prime: 0 },
    { phon: 'kapi', freq: 61, prime: 0 },
    { phon: 'k^p^l', freq: 164, prime: 0 },
    { phon: 'krip', freq: 23, prime: 0 },
    { phon: 'kru', freq: 38, prime: 0 },
    { phon: 'krap', freq: 44, prime: 0 },
    { phon: 'kruS^l', freq: 31, prime: 0 },
    { phon: 'kru^l', freq: 20, prime: 0 },
    { phon: 'kr^S', freq: 23, prime: 0 },
    { phon: 'k^p', freq: 63, prime: 0 },
    { phon: 'k^t', freq: 223, prime: 0 },
    { phon: 'dark', freq: 234, prime: 0 },
    { phon: 'dart', freq: 20, prime: 0 },
    { phon: 'dil', freq: 157, prime: 0 },
    { phon: 'did', freq: 21, prime: 0 },
    { phon: 'dip', freq: 199, prime: 0 },
    { phon: 'du', freq: 1366, prime: 0 },
    { phon: 'dal', freq: 23, prime: 0 },
    { phon: 'dat', freq: 28, prime: 0 },
    { phon: 'd^b^l', freq: 83, prime: 0 },
    { phon: 'dru', freq: 69, prime: 0 },
    { phon: 'drap', freq: 196, prime: 0 },
    { phon: 'dr^g', freq: 58, prime: 0 },
    { phon: 'd^k', freq: 21, prime: 0 },
    { phon: 'd^l', freq: 36, prime: 0 },
    { phon: 'd^st', freq: 78, prime: 0 },
    { phon: 'duti', freq: 95, prime: 0 },
    { phon: 'ist', freq: 183, prime: 0 },
    { phon: 'it', freq: 300, prime: 0 },
    { phon: 'glu', freq: 28, prime: 0 },
    { phon: 'gad', freq: 332, prime: 0 },
    { phon: 'gat', freq: 482, prime: 0 },
    { phon: 'grik', freq: 66, prime: 0 },
    { phon: 'grit', freq: 38, prime: 0 },
    { phon: 'gru', freq: 64, prime: 0 },
    { phon: 'grup', freq: 545, prime: 0 },
    { phon: 'gard', freq: 82, prime: 0 },
    { phon: 'g^tar', freq: 24, prime: 0 },
    { phon: 'kip', freq: 348, prime: 0 },
    { phon: 'ki', freq: 125, prime: 0 },
    { phon: 'lid', freq: 517, prime: 0 },
    { phon: 'lig', freq: 83, prime: 0 },
    { phon: 'lip', freq: 38, prime: 0 },
    { phon: 'list', freq: 343, prime: 0 },
    { phon: 'lig^l', freq: 77, prime: 0 },
    { phon: 'labi', freq: 22, prime: 0 },
    { phon: 'lak', freq: 109, prime: 0 },
    { phon: 'lup', freq: 23, prime: 0 },
    { phon: 'lus', freq: 68, prime: 0 },
    { phon: 'lat', freq: 169, prime: 0 },
    { phon: 'l^k', freq: 49, prime: 0 },
    { phon: 'l^ki', freq: 25, prime: 0 },
    { phon: 'l^kS^ri', freq: 24, prime: 0 },
    { phon: 'ad', freq: 53, prime: 0 },
    { phon: 'pap^', freq: 40, prime: 0 },
    { phon: 'park', freq: 242, prime: 0 },
    { phon: 'part', freq: 625, prime: 0 },
    { phon: 'parS^l', freq: 25, prime: 0 },
    { phon: 'partli', freq: 49, prime: 0 },
    { phon: 'parti', freq: 275, prime: 0 },
    { phon: 'par', freq: 10, prime: 0 },
    { phon: 'pi', freq: 24, prime: 0 },
    { phon: 'pik', freq: 24, prime: 0 },
    { phon: 'pip^l', freq: 887, prime: 0 },
    { phon: 'pis', freq: 221, prime: 0 },
    { phon: 'plat', freq: 57, prime: 0 },
    { phon: 'pl^g', freq: 28, prime: 0 },
    { phon: 'pl^s', freq: 72, prime: 0 },
    { phon: 'pak^t', freq: 64, prime: 0 },
    { phon: 'p^lis', freq: 159, prime: 0 },
    { phon: 'pal^si', freq: 290, prime: 0 },
    { phon: 'pul', freq: 129, prime: 0 },
    { phon: 'pap', freq: 31, prime: 0 },
    { phon: 'pas^b^l', freq: 373, prime: 0 },
    { phon: 'pas^bli', freq: 61, prime: 0 },
    { phon: 'pat', freq: 37, prime: 0 },
    { phon: 'prist', freq: 33, prime: 0 },
    { phon: 'prab^b^l', freq: 24, prime: 0 },
    { phon: 'prab^bli', freq: 261, prime: 0 },
    { phon: 'pradus', freq: 256, prime: 0 },
    { phon: 'prad^kt', freq: 195, prime: 0 },
    { phon: 'pragr^s', freq: 141, prime: 0 },
    { phon: 'p^t', freq: 63, prime: 0 },
    { phon: 'rid', freq: 273, prime: 0 },
    { phon: 'ril', freq: 261, prime: 0 },
    { phon: 'rili', freq: 275, prime: 0 },
    { phon: 'rab', freq: 40, prime: 0 },
    { phon: 'rak', freq: 121, prime: 0 },
    { phon: 'rak^t', freq: 20, prime: 0 },
    { phon: 'rad', freq: 29, prime: 0 },
    { phon: 'rut', freq: 69, prime: 0 },
    { phon: 'r^b', freq: 35, prime: 0 },
    { phon: 'r^g^d', freq: 20, prime: 0 },
    { phon: 'rul', freq: 215, prime: 0 },
    { phon: 'rupi', freq: 20, prime: 0 },
    { phon: 'r^S', freq: 60, prime: 0 },
    { phon: 'r^s^l', freq: 21, prime: 0 },
    { phon: 'skar', freq: 22, prime: 0 },
    { phon: 'skul', freq: 694, prime: 0 },
    { phon: 'skru', freq: 45, prime: 0 },
    { phon: 'sil', freq: 40, prime: 0 },
    { phon: 'sit', freq: 99, prime: 0 },
    { phon: 'sikr^t', freq: 105, prime: 0 },
    { phon: 'si', freq: 809, prime: 0 },
    { phon: 'sid', freq: 84, prime: 0 },
    { phon: 'sik', freq: 128, prime: 0 },
    { phon: 'Sarp', freq: 115, prime: 0 },
    { phon: 'Si', freq: 2860, prime: 0 },
    { phon: 'Sip', freq: 23, prime: 0 },
    { phon: 'Sit', freq: 77, prime: 0 },
    { phon: 'Sild', freq: 21, prime: 0 },
    { phon: 'Sak', freq: 66, prime: 0 },
    { phon: 'Sut', freq: 81, prime: 0 },
    { phon: 'Sap', freq: 108, prime: 0 },
    { phon: 'Sat', freq: 142, prime: 0 },
    { phon: 'Sr^g', freq: 22, prime: 0 },
    { phon: 'S^t', freq: 50, prime: 0 },
    { phon: 'slip', freq: 109, prime: 0 },
    { phon: 'slit', freq: 10, prime: 0 },
    { phon: 'sl^g', freq: 24, prime: 0 },
    { phon: 'sal^d', freq: 90, prime: 0 },
    { phon: 'sari', freq: 49, prime: 0 },
    { phon: 'spark', freq: 20, prime: 0 },
    { phon: 'spik', freq: 259, prime: 0 },
    { phon: 'spid', freq: 104, prime: 0 },
    { phon: 'spat', freq: 110, prime: 0 },
    { phon: 'star', freq: 58, prime: 0 },
    { phon: 'start', freq: 450, prime: 0 },
    { phon: 'start^l', freq: 22, prime: 0 },
    { phon: 'stil', freq: 51, prime: 0 },
    { phon: 'stip', freq: 22, prime: 0 },
    { phon: 'stak', freq: 165, prime: 0 },
    { phon: 'stap', freq: 273, prime: 0 },
    { phon: 'strik', freq: 20, prime: 0 },
    { phon: 'strit', freq: 307, prime: 0 },
    { phon: 'str^k', freq: 59, prime: 0 },
    { phon: 'str^g^l', freq: 93, prime: 0 },
    { phon: 'st^did', freq: 79, prime: 0 },
    { phon: 'st^di', freq: 391, prime: 0 },
    { phon: 'stup^d', freq: 25, prime: 0 },
    { phon: 's^bst^tut', freq: 46, prime: 0 },
    { phon: 's^t^l', freq: 26, prime: 0 },
    { phon: 's^ksid', freq: 62, prime: 0 },
    { phon: 's^k', freq: 20, prime: 0 },
    { phon: 'su', freq: 39, prime: 0 },
    { phon: 'sut', freq: 73, prime: 0 },
    { phon: 'sut^b^l', freq: 37, prime: 0 },
    { phon: 'tar', freq: 20, prime: 0 },
    { phon: 'targ^t', freq: 67, prime: 0 },
    { phon: 'ti', freq: 29, prime: 0 },
    { phon: 'tu', freq: 26162, prime: 0 },
    { phon: 'tul', freq: 79, prime: 0 },
    { phon: 'tap', freq: 212, prime: 0 },
    { phon: 'trit', freq: 127, prime: 0 },
    { phon: 'triti', freq: 24, prime: 0 },
    { phon: 'tri', freq: 161, prime: 0 },
    { phon: 'trup', freq: 82, prime: 0 },
    { phon: 'trat', freq: 20, prime: 0 },
    { phon: 'tr^b^l', freq: 189, prime: 0 },
    { phon: 'tr^k', freq: 84, prime: 0 },
    { phon: 'tru', freq: 237, prime: 0 },
    { phon: 'truli', freq: 237, prime: 0 },
    { phon: 'tr^st', freq: 76, prime: 0 },
    { phon: 'tr^sti', freq: 35, prime: 0 },
    { phon: 'tub', freq: 55, prime: 0 },
    { phon: '^gli', freq: 30, prime: 0 },
    { phon: '^p', freq: 1903, prime: 0 },
    { phon: '^s', freq: 672, prime: 0 },
    { phon: '-', freq: 1000, prime: 0 },
  ],
  freqNode: {
    RDL_rest_s: 0.0,
    RDL_rest_c: 1.0,
    RDL_wt_s: 0.0,
    RDL_wt_c: 1.0,
    RDL_post_c: 0.0,
  },
  primeNode: {
    RDL_rest_s: 0.0,
    RDL_rest_c: 1.0,
    RDL_wt_s: 0.0,
    RDL_wt_c: 1.0,
    RDL_post_c: 0.0,
  },
  continuumSpec: '',
  allophoneRelations: [],
})
