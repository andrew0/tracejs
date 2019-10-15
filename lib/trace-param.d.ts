export declare enum TracePhoneRole {
    NORMAL = 1,
    AMBIG = 2,
    ALLOPHONE = 3,
    OTHER = 4
}
/**
 * POW, VOC, DIF, ACU, GRD, VOI, BR
 */
export declare const CONTINUA_PER_FEATURE = 7;
export declare const NUM_FEATURES = 9;
export interface TracePhone {
    label: string;
    features: number[];
    durationScalar: number[];
    phonologicalRole: TracePhoneRole;
}
export interface TraceWord {
    phon: string;
    label?: string;
    freq: number;
    prime: number;
    valid?: boolean;
}
export interface Decay {
    F?: number;
    P?: number;
    W?: number;
}
export interface Rest {
    F?: number;
    P?: number;
    W?: number;
}
export interface Alpha {
    IF?: number;
    FP?: number;
    PW?: number;
    WP?: number;
    PF?: number;
}
export interface Gamma {
    F?: number;
    P?: number;
    W?: number;
}
export interface RdlNode {
    RDL_rest?: boolean;
    RDL_rest_s?: number;
    RDL_rest_c?: number;
    /**
     * ph->wd connection frequency effect:
     *   phoneme-to-word transmission is scaled by frequency values.
     */
    RDL_wt?: boolean;
    RDL_wt_s?: number;
    RDL_wt_c?: number;
    /**
     * post-perceptual frequenct effect:
     *   LCR analysis calculation scales word responce probabilities by freq values.
     */
    RDL_post?: boolean;
    RDL_post_c?: number;
}
export interface TraceAllophoneRelation {
    phon1: string;
    phon2: string;
}
export default interface TraceConfig {
    user?: string;
    dateTime?: string;
    comment?: string;
    modelInput: string;
    spread: number[];
    spreadScale: number[];
    min: number;
    max: number;
    /**
     * how many cycles should trace do in each step;
     * nreps can seriously affect the rate at which perceptual affects seem to take effect
     * versus how recently the input was presented.  with a high nreps value, an input will
     * be presented but words may seem to take relatively long time to become active.
     */
    nreps: number;
    /** tracenet will put a new phoneme/word unit every slicesPerPhon fslices */
    slicesPerPhon: number;
    /** number of feature slices */
    fSlices: number;
    /** rate at which F P W layers dacay */
    decay: Decay;
    /** resting level at F P W layers. */
    rest: Rest;
    /** strength of excitatory connections between following layer pairs?: IF FP PF PW WP  */
    alpha: Alpha;
    /** strength of inhibitory connections at F P W layers */
    gamma: Gamma;
    /** current lexicon */
    lexicon: TraceWord[];
    /** input a new feature every deltaInput slices, similar to PEAKp(i) calculation */
    deltaInput: number;
    /** amount of input noise */
    noiseSD: number;
    /** amount of processing noise */
    stochasticitySD: number;
    atten: number;
    bias: number;
    learningrate: number;
    /** length normalization?: binary */
    lengthNormalization: number;
    /** lexical frequency parameters. stores variables for three type of lexical frequency effects */
    freqNode: RdlNode;
    /** priming parameters. stores variables for three type of lexical priming */
    primeNode: RdlNode;
    /** ambiguous phoneme continuum parameters. three character mnemonic specify the current phoneme continuum. */
    continuumSpec: string;
    phonology: TracePhone[];
    allophoneRelations: TraceAllophoneRelation[];
}
export declare const createDefaultPhoneme: () => TracePhone;
/**
 * Creates a TraceConfig object with default values. Uses a function
 * instead of a const to prevent reference from getting mutated.
 */
export declare const createDefaultConfig: () => TraceConfig;
