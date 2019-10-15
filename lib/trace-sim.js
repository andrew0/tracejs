"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trace_net_1 = __importDefault(require("./trace-net"));
const trace_param_1 = require("./trace-param");
const util_1 = require("./util");
class TraceSim {
    constructor(config = trace_param_1.createDefaultConfig()) {
        this.config = config;
        this.inputLayer = [];
        this.featLayer = [];
        this.phonLayer = [];
        this.wordLayer = [];
        this.globalLexicalCompetition = [];
        this.globalPhonemeCompetition = [];
        this.tn = new trace_net_1.default(this.config);
        this.phonemes = this.tn.phonemes;
        this.maxDuration = Math.max(6 * this.config.modelInput.length * this.config.deltaInput, this.config.fSlices);
    }
    getStepsRun() {
        return this.inputLayer.length;
    }
    cycle(numCycles) {
        numCycles = Math.min(this.maxDuration, numCycles);
        for (let i = 0; i < numCycles; i++) {
            this.inputLayer.push(util_1.copy2D(this.tn.inputLayer));
            this.featLayer.push(util_1.copy2D(this.tn.featLayer));
            this.phonLayer.push(util_1.copy2D(this.tn.phonLayer));
            this.wordLayer.push(util_1.copy2D(this.tn.wordLayer));
            this.globalLexicalCompetition.push(this.tn.globalLexicalCompetitionIndex);
            this.globalPhonemeCompetition.push(this.tn.globalPhonemeCompetitionIndex);
            this.tn.cycle();
        }
    }
}
exports.default = TraceSim;
//# sourceMappingURL=trace-sim.js.map