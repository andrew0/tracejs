<template>
  <SimulationChart
    :chart-data="chartData"
    chart-title="Feature Activations"
    x-axis-title="Temporal Alignment"
    y-axis-title="Feature Continua"
    :y-label-callback="yLabelCallback"
    :num-x-ticks="store.config.fSlices + 1"
    :num-y-ticks="numXTicks"
    :y-step-size="numYTicks"
    :sim-config="store.config"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

// @ts-ignore
import SimulationChart from './SimulationChart';
import { CONTINUA, NUM_FEATURES } from '../../constants';
import { getStore } from '../../store';

export default defineComponent({
  components: { SimulationChart },
  setup() {
    const store = getStore();
    return {
      store,
      numXTicks: CONTINUA.length * NUM_FEATURES,
      numYTicks: NUM_FEATURES,
      chartData: computed(() => store.sim.value?.featLayer[store.currentCycle.value] || []),
      yLabelCallback(_: any, index: number) {
        if (index < CONTINUA.length) {
          return CONTINUA[index];
        }
        return null;
      },
    };
  },
});
</script>
