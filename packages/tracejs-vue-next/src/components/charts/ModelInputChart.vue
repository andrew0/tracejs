<template>
  <SimulationChart
    :chart-data="chartData"
    chart-title="Model Input"
    x-axis-title="Time"
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
import { TraceNet } from 'tracejs';

// @ts-ignore
import SimulationChart from './SimulationChart';
import { CONTINUA, NUM_FEATURES } from '../../constants';
import { getStore } from '../../store';

export default defineComponent({
  components: { SimulationChart },
  props: {
    reactive: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = getStore();
    return {
      store,
      numXTicks: CONTINUA.length * NUM_FEATURES,
      numYTicks: NUM_FEATURES,
      chartData: computed(() => {
        if (!props.reactive) {
          return store.sim.value?.inputLayer[store.currentCycle.value] || [];
        } else {
          return new TraceNet(store.config).inputLayer || [];
        }
      }),
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
