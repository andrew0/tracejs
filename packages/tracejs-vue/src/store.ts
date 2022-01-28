import {
  TraceSim,
  createDefaultConfig,
  formatAnalysis,
  doSimAnalysis,
  TraceCalculationType,
  TraceChoice,
  TraceCompetitionType,
  TraceDomain,
  ModelInputError,
} from 'tracejs';

import { reactive, ref, provide, inject, computed } from 'vue';

// format data as tab separated values
const formatData = (data?: (string | number)[][]) =>
  data ? data.map((row) => row.join('\t')).join('\n') : '';

// colors for analysis chart
const chartColors = [
  '#e6194b',
  '#3cb44b',
  '#ffe119',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#bcf60c',
  '#fabebe',
  '#008080',
  '#e6beff',
  '#9a6324',
  '#fffac8',
  '#800000',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000075',
  '#808080',
  '#000000',
];

class Store {
  private _config = reactive(createDefaultConfig());
  get config() {
    return this._config;
  }

  private _analysisConfig = reactive({
    domain: TraceDomain.WORDS,
    itemsToWatch: 10 as number | string[],
    calculationType: TraceCalculationType.STATIC,
    alignment: 4,
    choice: TraceChoice.NORMAL,
    kValue: 0,
    competType: TraceCompetitionType.RAW,
    competSlope: 4,
    excludeSilence: false,
  });
  get analysisConfig() {
    return this._analysisConfig;
  }

  private _sortedPhonemes = computed(() =>
    [...this.config.phonology].sort((a, b) => a.label.localeCompare(b.label))
  );
  get sortedPhonemes() {
    return this._sortedPhonemes;
  }

  private _sim = ref<TraceSim | null>(null);
  get sim() {
    return this._sim;
  }

  private _cyclesToCalculate = ref(60);
  get cyclesToCalculate() {
    return this._cyclesToCalculate;
  }

  private _calculatedCycles = computed(() => this._sim.value?.getStepsRun() || 0);
  get calculatedCycles() {
    return this._calculatedCycles;
  }

  private _currentCycle = ref(0);
  get currentCycle() {
    return this._currentCycle;
  }

  private _formattedInputData = computed(() =>
    formatData(this._sim.value?.getInputData(this._currentCycle.value))
  );
  get formattedInputData() {
    return this._formattedInputData;
  }

  private _formattedFeatureData = computed(() =>
    formatData(this._sim.value?.getFeatureData(this._currentCycle.value))
  );
  get formattedFeatureData() {
    return this._formattedFeatureData;
  }

  private _formattedPhonemeData = computed(() =>
    formatData(this._sim.value?.getPhonemeData(this._currentCycle.value))
  );
  get formattedPhonemeData() {
    return this._formattedPhonemeData;
  }

  private _formattedWordData = computed(() =>
    formatData(this._sim.value?.getWordData(this._currentCycle.value))
  );
  get formattedWordData() {
    return this._formattedWordData;
  }

  private _formattedLevelsAndFlowData = computed(() =>
    formatData(
      this._sim.value
        ?.getAllLevelsAndFlowData()
        .map(([data], index) => [index, ...data.map((num) => num.toFixed(13).padEnd(18, ' '))])
    )
  );
  get formattedLevelsAndFlowData() {
    return this._formattedLevelsAndFlowData;
  }

  private _analysisData = ref<any[]>([]);
  get analysisData() {
    return this._analysisData;
  }

  private _formattedAnalysisData = computed(() => formatAnalysis(this._analysisData.value, true));
  get formattedAnalysisData() {
    return this._formattedAnalysisData;
  }

  private _useBoxChart = ref(false);
  get useBoxChart() {
    return this._useBoxChart;
  }

  private _isModelInputValid = ref(true);
  get isModelInputValid() {
    return this._isModelInputValid;
  }

  updateAnalysis() {
    // TODO: fix TraceSim typing
    this._analysisData.value = doSimAnalysis({
      ...this.analysisConfig,
      sim: this.sim.value as any,
    }).map((x, idx) => ({
      ...x,
      fill: false,
      borderColor: chartColors[idx],
      showLine: true,
    }));
  }

  runSimulation() {
    this._isModelInputValid.value = true;
    try {
      // create a copy of the config object
      // trace.js accesses the object a lot, and it's a lot slower if it's
      // a reactive proxy.
      const configCopy = JSON.parse(JSON.stringify(this._config));

      console.time('trace.js');
      const sim = new TraceSim(configCopy);
      sim.cycle(this._cyclesToCalculate.value);
      console.timeEnd('trace.js');

      this._currentCycle.value = Math.min(
        Math.max(this.currentCycle.value, 0),
        this._calculatedCycles.value
      );
      this._sim.value = sim;

      this.updateAnalysis();
    } catch (e) {
      if (e instanceof ModelInputError) {
        this._isModelInputValid.value = false;
      }
      throw e;
    }
  }
}

export const StoreSymbol = Symbol();

export const createStore = () => {
  const store = new Store();
  provide(StoreSymbol, store);
  return store;
};

export const getStore = () => inject<Store>(StoreSymbol)!;
