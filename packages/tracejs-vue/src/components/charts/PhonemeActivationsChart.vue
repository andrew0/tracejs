<template>
  <SimulationChart
    :chart-data="chartData"
    chart-title="Phoneme Activations"
    x-axis-title="Temporal Alignment"
    y-axis-title="Phoneme"
    :y-label-callback="yLabelCallback"
    :num-x-ticks="Math.ceil(store.config.fSlices / store.config.slicesPerPhon) + 1"
    :num-y-ticks="store.config.phonology.length"
    :y-step-size="1"
    :sim-config="store.config"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

// @ts-ignore
import SimulationChart from './SimulationChart';
import { getStore } from '../../store';

export default defineComponent({
  components: { SimulationChart },
  setup() {
    const store = getStore();
    return {
      store,
      chartData: computed(() => store.sim.value?.phonLayer[store.currentCycle.value] || []),
      yLabelCallback(_: any, index: number) {
        if (index < store.sortedPhonemes.value.length) {
          return store.sortedPhonemes.value[index].label;
        }
        return null;
      },
    };
  },
});
</script>
