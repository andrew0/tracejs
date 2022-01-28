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
  readonly config = reactive(createDefaultConfig());
  readonly analysisConfig = reactive({
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
  readonly sortedPhonemes = computed(() =>
    [...this.config.phonology].sort((a, b) => a.label.localeCompare(b.label))
  );
  readonly sim = ref<TraceSim | null>(null);
  readonly cyclesToCalculate = ref(60);
  readonly calculatedCycles = computed(() => this.sim.value?.getStepsRun() || 0);
  readonly currentCycle = ref(0);
  readonly formattedInputData = computed(() =>
    formatData(this.sim.value?.getInputData(this.currentCycle.value))
  );
  readonly formattedFeatureData = computed(() =>
    formatData(this.sim.value?.getFeatureData(this.currentCycle.value))
  );
  readonly formattedPhonemeData = computed(() =>
    formatData(this.sim.value?.getPhonemeData(this.currentCycle.value))
  );
  readonly formattedWordData = computed(() =>
    formatData(this.sim.value?.getWordData(this.currentCycle.value))
  );
  readonly formattedLevelsAndFlowData = computed(() =>
    formatData(
      this.sim.value
        ?.getAllLevelsAndFlowData()
        .map(([data], index) => [index, ...data.map((num) => num.toFixed(13).padEnd(18, ' '))])
    )
  );
  readonly analysisData = ref<any[]>([]);
  readonly formattedAnalysisData = computed(() => formatAnalysis(this.analysisData.value, true));
  readonly useBoxChart = ref(false);
  readonly isModelInputValid = ref(true);

  updateAnalysis() {
    // TODO: fix TraceSim typing
    this.analysisData.value = doSimAnalysis({
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
    this.isModelInputValid.value = true;
    try {
      // create a copy of the config object
      // trace.js accesses the object a lot, and it's a lot slower if it's
      // a reactive proxy.
      const configCopy = JSON.parse(JSON.stringify(this.config));

      console.time('trace.js');
      const sim = new TraceSim(configCopy);
      sim.cycle(this.cyclesToCalculate.value);
      console.timeEnd('trace.js');

      this.currentCycle.value = Math.min(
        Math.max(this.currentCycle.value, 0),
        this.calculatedCycles.value
      );
      this.sim.value = sim;

      this.updateAnalysis();
    } catch (e) {
      if (e instanceof ModelInputError) {
        this.isModelInputValid.value = false;
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
