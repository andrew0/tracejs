import { TracePhone } from './trace-param';
interface TracePhoneInternal extends TracePhone {
    spreadOffset?: number;
    norm?: number;
    spread?: number[][];
    index?: number;
}
export default class TracePhones {
    private static readonly MAX_STEPS;
    private phonemes;
    private ambiguousPhonemes;
    constructor(phonemes: TracePhone[]);
    /**
     * Sorts the phonemes by the label attribute
     */
    private sortPhonemes;
    sorted(): TracePhoneInternal[];
    byIndex(index: number): TracePhoneInternal;
    byLabel(label: string): TracePhoneInternal;
    /**
     * Spreads the phonesmes over time according to the spread array. This
     * should be run before a TraceSim is run, and after any change to the
     * ambiguous phoneme information.
     *
     * @param spread        spread[] in TraceParam
     * @param scale         spreadScale[] in TraceParam
     * @param min           min in TraceParam
     * @param max           max in TraceParam
     */
    spreadPhons(spread: number[], scale: number[], min: number, max: number): void;
    /**
     * Create in this object a phoneme continuum of the same format as the
     * phonDefs matricies.
     * Throws an exception if arguments are unreasonable.
     * Be sure to run spreadPhons() after running this!
     *
     * @param from      one endpoint
     * @param to        the other endpoint
     * @param steps     the number of steps (2-9)
     */
    makePhonemeContinuum(from: string, to: string, steps: number): void;
}
export {};
