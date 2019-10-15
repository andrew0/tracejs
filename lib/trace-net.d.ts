import TraceConfig from './trace-param';
import TracePhones from './trace-phones';
export default class TraceNet {
    private config;
    phonemes: TracePhones;
    private lengthNormalizationScale;
    inputLayer: number[][];
    featLayer: number[][];
    featNet: number[][];
    phonLayer: number[][];
    phonNet: number[][];
    wordLayer: number[][];
    wordNet: number[][];
    globalLexicalCompetitionIndex: number;
    globalPhonemeCompetitionIndex: number;
    private pww;
    private wpw;
    private fpw;
    private pfw;
    private inputSlice;
    private __nreps;
    constructor(config?: TraceConfig);
    /**
     * Sets the configuration and initializes related objects
     */
    setConfig(config: TraceConfig): void;
    reset(): void;
    private getPSlices;
    private getWSlices;
    private clamp;
    /**
     * Create the input layer
     *  loop through all the phonemes, and copy the corresponding features to it.
     *  the offset for the phoneme should be used inorder to center
     * Variables which have been left out from original trace, M&E did not use them:
     *  WEIGHTp(i),c,fs   STRENGTHp(i)   PEAKp(i)   SUSp(i)   RATEp(i)
     * converts the model input into a pseudo-spectral input representation, store in inputLayer
     */
    createInput(): void;
    private actFeatures;
    /**
     * Feature to phoneme activations
     */
    private featToPhon;
    /** calculate inhibitions in phoneme layer **/
    phonToPhon(): void;
    phonToFeat(): void;
    wordToPhon(): void;
    phonToWord(): void;
    /**
     * word to word inhibition: operates the same as phoneme inhibition -- calculate
     * the total amount of inhibition at each slice and apply that equally to all words
     * that overlap with that slice somewhere.  this means that word length increases
     * the amount of lexical inhibition linearly.
     */
    wordToWord(): void;
    /**
     * final processing of feature units incorporates stochasticity (if on) and
     * implements decay to resting level behavior.
     */
    featUpdate(): void;
    /**
     * final processing of phoneme units incorporates stochasticity (if on) and
     * implements decay to resting level behavior.
     */
    phonUpdate(): void;
    /**
     * final processing of word units incorporates stochasticity (if on) and
     * implements decay to resting level behavior.
     */
    wordUpdate(): void;
    cycle(): void;
}
