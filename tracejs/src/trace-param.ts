export enum TracePhoneRole {
  NORMAL = 1,
  AMBIG,
  ALLOPHONE,
  OTHER
}

/**
 * POW, VOC, DIF, ACU, GRD, VOI, BR
 */
export const CONTINUA_PER_FEATURE = 7
export const NUM_FEATURES = 9
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
  RDL_rest?: boolean // = true (on)
  RDL_rest_s?: number // = 0.06
  RDL_rest_c?: number // = 1.0

  /**
   * ph->wd connection frequency effect:
   *   phoneme-to-word transmission is scaled by frequency values.
   */
  RDL_wt?: boolean // = true (on)
  RDL_wt_s?: number // = 0.13
  RDL_wt_c?: number // = 1.0

  /**
   * post-perceptual frequenct effect:
   *   LCR analysis calculation scales word responce probabilities by freq values.
   */
  RDL_post?: boolean // = true (on)
  //RDL_post_s: number //purposely left out of specification
  RDL_post_c?: number // = 15.0
}

export interface TraceAllophoneRelation {
  phon1: string
  phon2: string
}

export default interface TraceConfig {
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

/**
 * Creates a TraceConfig object with default values. Uses a function
 * instead of a const to prevent reference from getting mutated.
 */
export const createDefaultConfig = (): TraceConfig => ({
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
    PF: 0.0
  },
  gamma: {
    F: 0.04,
    P: 0.04,
    W: 0.03
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
      phonologicalRole: TracePhoneRole.NORMAL
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
      phonologicalRole: TracePhoneRole.NORMAL
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
      phonologicalRole: TracePhoneRole.NORMAL
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
      phonologicalRole: TracePhoneRole.NORMAL
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
      phonologicalRole: TracePhoneRole.NORMAL
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
      phonologicalRole: TracePhoneRole.NORMAL
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
      phonologicalRole: TracePhoneRole.NORMAL
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
      phonologicalRole: TracePhoneRole.NORMAL
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
      phonologicalRole: TracePhoneRole.NORMAL
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
      phonologicalRole: TracePhoneRole.NORMAL
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
      phonologicalRole: TracePhoneRole.NORMAL
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
      phonologicalRole: TracePhoneRole.NORMAL
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
      phonologicalRole: TracePhoneRole.NORMAL
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
      phonologicalRole: TracePhoneRole.NORMAL
    }
  ],
  lexicon: [
    { phon: '^br^pt', freq: 0, prime: 0 },
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
    { phon: '-', freq: 0, prime: 0 }
  ],
  freqNode: {},
  primeNode: {},
  continuumSpec: '',
  allophoneRelations: []
})
