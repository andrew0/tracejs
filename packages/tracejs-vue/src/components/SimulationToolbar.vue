<template>
  <div :class="$style.toolbar">
    <template v-if="isModelInputValid">
      <label for="cycles-to-calculate">Cycles to calculate:</label>
      <input
        v-model="cyclesToCalculate"
        class="input"
        id="cycles-to-calculate"
        type="number"
        style="width: 6rem; margin: 0 0.5rem"
      />
      <a class="button" @click="calculate">Simulate</a>

      <template v-if="showCycles && calculatedCycles">
        <label for="current-cycle" style="margin-left: 2.5rem">Current cycle:</label>

        <a
          style="margin-left: 0.5rem"
          class="button"
          @click="currentCycle = Number(currentCycle) - 1"
        >
          -
        </a>

        <div class="select">
          <select id="current-cycle" v-model="currentCycle">
            <option v-for="(n, index) in calculatedCycles" :key="index" :value="index">
              {{ index }}
            </option>
          </select>
        </div>

        <a class="button" @click="currentCycle = Number(currentCycle) + 1">+</a>

        <input
          v-model="currentCycle"
          style="margin-left: 0.5rem; width: 200px"
          class="slider"
          step="1"
          min="0"
          :max="calculatedCycles - 1"
          type="range"
        />

        <a style="margin-left: 0.5rem" class="button" @click="toggleTimer">{{
          timer ? 'stop animation' : 'start animation'
        }}</a>
      </template>

      <template v-if="showChartOptions">
        <label class="checkbox" style="margin-left: 2rem">
          <input type="checkbox" v-model="useBoxChart" />
          Visualize word/phoneme activations
        </label>
      </template>

      <div style="flex: 1">
        <a class="button" @click="saveData" style="float: right">Save sim data</a>
      </div>
    </template>
    <template v-else> The provided model input contains invalid characters. </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import FileSaver from 'file-saver';
import JSZip from '@progress/jszip-esm';

import { getStore } from '../store';

const serializeData = (data: any[][][]) => {
  const numRows = data[0]?.length || 0;
  const allCycles: any[][] = [];
  for (let row = 0; row < numRows; row++) {
    for (let cycle = 0; cycle < data.length; cycle++) {
      allCycles.push([cycle, ...data[cycle][row]]);
    }
  }
  return allCycles.map((row) => row.join(', ')).join('\n');
};

export default defineComponent({
  name: 'SimulationToolbar',
  props: {
    showCycles: {
      type: Boolean,
      default: false,
    },
    showChartOptions: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = getStore();
    const currentCycle = computed({
      get: (): string | number => store.currentCycle.value,
      set: (v: string | number) => {
        store.currentCycle.value = Math.min(
          Math.max(Number(v), 0),
          store.calculatedCycles.value - 1
        );
      },
    });
    const timer = ref<number | null>(null);
    const incOrCancel = () => {
      currentCycle.value = Number(currentCycle.value) + 1;
      if (timer.value && currentCycle.value === store.calculatedCycles.value - 1) {
        clearInterval(timer.value);
        timer.value = null;
      }
    };

    return {
      isModelInputValid: store.isModelInputValid,
      useBoxChart: store.useBoxChart,
      calculatedCycles: store.calculatedCycles,
      cyclesToCalculate: computed({
        get: () => store.cyclesToCalculate.value.toString(),
        set: (v: string) => {
          store.cyclesToCalculate.value = Number(v);
        },
      }),
      currentCycle,
      timer,
      calculate() {
        store.runSimulation();
      },
      toggleTimer() {
        if (!timer.value) {
          timer.value = setInterval(incOrCancel, 250) as any;
          incOrCancel();
        } else {
          clearInterval(timer.value);
          timer.value = null;
        }
      },
      async saveData() {
        const sim = store.sim.value;
        if (!sim) {
          return;
        }

        const zip = new JSZip();
        const { input, feature, phoneme, word } = sim.getSimData();
        zip.file('input.csv', serializeData(input));
        zip.file('feature.csv', serializeData(feature));
        zip.file('phoneme.csv', serializeData(phoneme));
        zip.file('word.csv', serializeData(word));
        FileSaver.saveAs(await zip.generateAsync({ type: 'blob' }), 'tracejs-sim.zip');
      },
    };
  },
});
</script>

<style module>
.toolbar {
  display: flex;
  align-items: center;
  background: white;
  padding: 0.5rem;
}
</style>
