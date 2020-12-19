import TraceNet from './trace-net';
import TraceConfig, { createDefaultConfig } from './trace-param';
import TracePhones from './trace-phones';
import { copy2D } from './util';

export default class TraceSim {
  private tn: TraceNet;
  public phonemes: TracePhones;
  private maxDuration: number;
  public inputLayer: number[][][] = [];
  public featLayer: number[][][] = [];
  public phonLayer: number[][][] = [];
  public wordLayer: number[][][] = [];
  public globalLexicalCompetition: number[] = [];
  public globalPhonemeCompetition: number[] = [];

  constructor(public config: TraceConfig = createDefaultConfig()) {
    this.tn = new TraceNet(this.config);
    this.phonemes = this.tn.phonemes;
    this.maxDuration = Math.max(
      6 * this.config.modelInput.length * this.config.deltaInput,
      this.config.fSlices
    );
  }

  public getStepsRun(): number {
    return this.inputLayer.length;
  }

  public cycle(numCycles: number) {
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
