import TraceConfig from './trace-param';
import TracePhones from './trace-phones';
export default class TraceSim {
    config: TraceConfig;
    private tn;
    phonemes: TracePhones;
    private maxDuration;
    inputLayer: number[][][];
    featLayer: number[][][];
    phonLayer: number[][][];
    wordLayer: number[][][];
    globalLexicalCompetition: number[];
    globalPhonemeCompetition: number[];
    constructor(config?: TraceConfig);
    getStepsRun(): number;
    cycle(numCycles: number): void;
}
