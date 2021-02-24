<template>
  <div :class="$style.toolbar">
    <label for="cycles-to-calculate">Cycles to calculate:</label>
    <input
      v-model="cyclesToCalculate"
      class="input"
      id="cycles-to-calculate"
      type="number"
      style="width: 6rem; margin: 0 0.5rem"
    />
    <a class="button" @click="calculate">Calculate</a>

    <template v-if="showCycles">
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import { getStore } from '../store';

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
          timer.value = setInterval(incOrCancel, 250);
          incOrCancel();
        } else {
          clearInterval(timer.value);
          timer.value = null;
        }
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
