import TraceNet from './trace-net';
import { createDefaultConfig } from './trace-param';
import { copy2D } from './util';
export default class TraceSim {
    constructor(config = createDefaultConfig()) {
        this.config = config;
        this.inputLayer = [];
        this.featLayer = [];
        this.phonLayer = [];
        this.wordLayer = [];
        this.globalLexicalCompetition = [];
        this.globalPhonemeCompetition = [];
        this.tn = new TraceNet(this.config);
        this.phonemes = this.tn.phonemes;
        this.maxDuration = Math.max(6 * this.config.modelInput.length * this.config.deltaInput, this.config.fSlices);
    }
    getStepsRun() {
        return this.inputLayer.length;
    }
    cycle(numCycles) {
        numCycles = Math.min(this.maxDuration, numCycles);
        for (let i = 0; i < numCycles; i++) {
            this.inputLayer.push(copy2D(this.tn.inputLayer));
            this.featLayer.push(copy2D(this.tn.featLayer));
            this.phonLayer.push(copy2D(this.tn.phonLayer));
            this.wordLayer.push(copy2D(this.tn.wordLayer));
            this.globalLexicalCompetition.push(this.tn.globalLexicalCompetitionIndex);
            this.globalPhonemeCompetition.push(this.tn.globalPhonemeCompetitionIndex);
            this.tn.cycle();
        }
    }
}
//# sourceMappingURL=trace-sim.js.map