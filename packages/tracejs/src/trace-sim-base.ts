import { Writable } from 'stream';

import TraceNet from './trace-net';
import TraceConfig, { createDefaultConfig } from './trace-param';
import TracePhones from './trace-phones';
import { copy2D } from './util';

export default abstract class TraceSimBase {
  private tn: TraceNet;
  public phonemes: TracePhones;
  private maxDuration: number;
  public inputLayer: number[][][] = [];
  public featLayer: number[][][] = [];
  public phonLayer: number[][][] = [];
  public wordLayer: number[][][] = [];
  public globalFeatureCompetition: number[] = [];
  public globalLexicalCompetition: number[] = [];
  public globalPhonemeCompetition: number[] = [];
  public globalPhonToWordSum: number[] = [];
  public globalWordToPhonSum: number[] = [];
  public globalFeatToPhonSum: number[] = [];
  public globalPhonToFeatSum: number[] = [];
  public globalFeatSumAll: number[] = [];
  public globalFeatSumPos: number[] = [];
  public globalPhonSumAll: number[] = [];
  public globalPhonSumPos: number[] = [];
  public globalWordSumAll: number[] = [];
  public globalWordSumPos: number[] = [];

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
      this.globalFeatureCompetition.push(this.tn.globalFeatureCompetitionIndex);
      this.globalLexicalCompetition.push(this.tn.globalLexicalCompetitionIndex);
      this.globalPhonemeCompetition.push(this.tn.globalPhonemeCompetitionIndex);
      this.globalPhonToWordSum.push(this.tn.globalPhonToWordSum);
      this.globalWordToPhonSum.push(this.tn.globalWordToPhonSum);
      this.globalFeatToPhonSum.push(this.tn.globalFeatToPhonSum);
      this.globalPhonToFeatSum.push(this.tn.globalPhonToFeatSum);
      this.globalFeatSumAll.push(this.tn.globalFeatSumAll);
      this.globalFeatSumPos.push(this.tn.globalFeatSumPos);
      this.globalPhonSumAll.push(this.tn.globalPhonSumAll);
      this.globalPhonSumPos.push(this.tn.globalPhonSumPos);
      this.globalWordSumAll.push(this.tn.globalWordSumAll);
      this.globalWordSumPos.push(this.tn.globalWordSumPos);
      this.tn.cycle();
    }
  }

  public getInputData(cycle: number) {
    return this.inputLayer[cycle].map((row, index) => [index, ...row.map((x) => x.toFixed(4))]);
  }

  public getFeatureData(cycle: number) {
    return this.featLayer[cycle].map((row, index) => [index, ...row.map((x) => x.toFixed(4))]);
  }

  public getPhonemeData(cycle: number) {
    return this.phonLayer[cycle].map((row, index) => [
      (this.phonemes && this.phonemes.byIndex(index)?.label) || '?',
      ...row.map((x) => x.toFixed(4)),
    ]);
  }

  public getWordData(cycle: number) {
    return this.wordLayer[cycle].map((row, index) => [
      this.config.lexicon[index].phon,
      ...row.map((x) => x.toFixed(4)),
    ]);
  }

  public getLevelsAndFlowData(cycle: number) {
    return [
      [
        this.globalFeatSumAll[cycle],
        this.globalFeatSumPos[cycle],
        this.globalFeatureCompetition[cycle],
        this.globalPhonSumAll[cycle],
        this.globalPhonSumPos[cycle],
        this.globalPhonemeCompetition[cycle],
        this.globalWordSumAll[cycle],
        this.globalWordSumPos[cycle],
        this.globalLexicalCompetition[cycle],
        this.globalFeatToPhonSum[cycle],
        this.globalPhonToFeatSum[cycle],
        this.globalPhonToWordSum[cycle],
        this.globalWordToPhonSum[cycle],
      ],
    ];
  }

  public getAllInputData() {
    return Array.from({ length: this.inputLayer.length }, (_, k) => this.getInputData(k));
  }

  public getAllFeatureData() {
    return Array.from({ length: this.featLayer.length }, (_, k) => this.getFeatureData(k));
  }

  public getAllPhonemeData() {
    return Array.from({ length: this.phonLayer.length }, (_, k) => this.getPhonemeData(k));
  }

  public getAllWordData() {
    return Array.from({ length: this.wordLayer.length }, (_, k) => this.getWordData(k));
  }

  public getAllLevelsAndFlowData() {
    return Array.from({ length: this.globalLexicalCompetition.length }, (_, k) =>
      this.getLevelsAndFlowData(k)
    );
  }

  public serializeInputData(prefix: string[] = []) {
    const fullPrefix = [this.config.modelInput, ...prefix];
    return serializeData(this.getAllInputData(), fullPrefix);
  }

  public serializeFeatureData(prefix: string[] = []) {
    const fullPrefix = [this.config.modelInput, ...prefix];
    return serializeData(this.getAllFeatureData(), fullPrefix);
  }

  public serializePhonemeData(prefix: string[] = []) {
    const fullPrefix = [this.config.modelInput, ...prefix];
    return serializeData(this.getAllPhonemeData(), fullPrefix);
  }

  public serializeWordData(prefix: string[] = []) {
    const fullPrefix = [this.config.modelInput, ...prefix];
    return serializeData(this.getAllWordData(), fullPrefix);
  }

  public serializeLevelsAndFlowData(prefix: string[] = []) {
    const fullPrefix = [this.config.modelInput, ...prefix];
    return serializeData(this.getAllLevelsAndFlowData(), fullPrefix);
  }

  public getSimData() {
    return {
      input: this.getAllInputData(),
      feature: this.getAllFeatureData(),
      phoneme: this.getAllPhonemeData(),
      word: this.getAllWordData(),
      levelsAndFlows: this.getAllLevelsAndFlowData(),
    };
  }

  abstract appendInputData(file: Writable, prefix?: string[]): Promise<void>;

  abstract appendFeatureData(file: Writable, prefix?: string[]): Promise<void>;

  abstract appendPhonemeData(file: Writable, prefix?: string[]): Promise<void>;

  abstract appendWordData(file: Writable, prefix?: string[]): Promise<void>;

  abstract appendLevelsAndFlowData(file: Writable, prefix?: string[]): Promise<void>;

  abstract writeFiles(dir: string, prefix?: string): void | Promise<void>;

  abstract appendFiles(files: Writable[], prefix?: string[]): Promise<void>;
}

function serializeData(data: any[][][], prefix: string[]) {
  const numRows = data[0]?.length || 0;
  const allCycles: any[][] = [];
  for (let row = 0; row < numRows; row++) {
    for (let cycle = 0; cycle < data.length; cycle++) {
      allCycles.push([cycle, ...data[cycle][row]]);
    }
  }

  // put cycle first, then prefix, then rest of row
  return allCycles.map((row) => [row[0], ...prefix, row.slice(1)].join(', ')).join('\n') + '\n';
}
