<template>
  <div :class="$style.toolbar">
    <label for="cycles" style="margin-right: 0.5rem">Cycles to Calculate</label>
    <input
      v-model="cyclesToCalculate"
      class="input"
      id="cycles"
      type="number"
      style="width: 6rem; margin-right: 0.5rem"
    />
    <a class="button" @click="calculate">Calculate</a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { getStore } from '../store';

export default defineComponent({
  name: 'SimulationToolbar',
  setup() {
    const store = getStore();
    return {
      get cyclesToCalculate() {
        return store.cyclesToCalculate.value.toString();
      },
      set cyclesToCalculate(val: string) {
        store.cyclesToCalculate.value = Number(val);
      },
      calculate() {
        store.runSimulation();
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
