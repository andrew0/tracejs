import TraceSim from './trace-sim';
export interface TraceDataset {
    label: string;
    data: TracePoint[];
}
export interface TracePoint {
    x: number;
    y: number;
}
/** are we watching phonemes or words? */
export declare enum TraceDomain {
    PHONEMES = 0,
    WORDS = 1
}
/** graph contents */
export declare enum TraceContentType {
    RESPONSE_PROBABILITIES = 0,
    ACTIVATIONS = 1,
    COMPETITION_INDEX = 2
}
/** how alignment works */
export declare enum TraceCalculationType {
    AVERAGE = 0,
    MAX_POSTHOC = 1,
    STATIC = 2,
    FRAUENFELDER = 3,
    MAX_ADHOC = 4,
    MAX_ADHOC_2 = 5
}
/** how choice works */
export declare enum TraceChoice {
    NORMAL = 0,
    FORCED = 1
}
export declare enum TraceCompetitionType {
    RAW = 0,
    FIRST_DERIVATIVE = 1,
    SECOND_DERIVATIVE = 2
}
export interface TraceSimAnalysisConfig {
    sim: TraceSim;
    domain: TraceDomain;
    itemsToWatch: string[] | number;
    calculationType: TraceCalculationType;
    alignment?: number;
    choice: TraceChoice;
    kValue?: number;
    competType?: TraceCompetitionType;
    competSlope?: number;
}
/**
 * Creates a new instance of TraceAnalysis.
 * @param sim             TraceSim object
 * @param domain          PHONEMES or WORDS
 * @param watchType
 * @param itemsToWatch    items to watch (Vector of chars, Vector of TraceWords, or null)
 * @param watchTopN       0 to use items, or otherwise N
 * @param calculationType AVERAGE, MAX_ADHOC, MAX_ADHOC2, MAX_POSTHOC, STATIC, or FRAUNFELDER
 * @param alignment       if alignment == STATIC
 * @param choice          NORMAL or FORCED
 * @param kValue          LCR exponent (if 0, use activations)
 */
export declare const doSimAnalysis: (config: TraceSimAnalysisConfig) => TraceDataset[];
export declare const formatAnalysis: (data: TraceDataset[], padLabels?: boolean) => string;
