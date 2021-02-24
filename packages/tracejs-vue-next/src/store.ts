import { TraceSim, createDefaultConfig } from 'tracejs';

import { reactive, ref, provide, inject, computed } from 'vue';

// format data as tab separated values
const formatData = (data?: (string | number)[][]) =>
  data ? data.map((row) => row.join('\t')).join('\n') : '';

class Store {
  private _config = reactive(createDefaultConfig());
  get config() {
    return this._config;
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

  private _useBoxChart = ref(false);
  get useBoxChart() {
    return this._useBoxChart;
  }

  runSimulation() {
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
  }
}

export const StoreSymbol = Symbol();

export const createStore = () => {
  const store = new Store();
  provide(StoreSymbol, store);
  return store;
};

export const getStore = () => inject<Store>(StoreSymbol)!;
