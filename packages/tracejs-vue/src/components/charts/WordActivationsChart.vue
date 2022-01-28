<template>
  <SimulationChart
    :chart-data="chartData"
    chart-title="Word Activations"
    x-axis-title="Temporal Alignment"
    y-axis-title="Word"
    :y-label-callback="yLabelCallback"
    :num-x-ticks="Math.ceil(store.config.fSlices / store.config.slicesPerPhon) + 1"
    :num-y-ticks="10"
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

    const topData = computed(() => {
      const rawData = store.sim.value?.wordLayer[store.currentCycle.value] || [];
      // associate each word with corresponding row in an array [word, row]
      const data = rawData.map((row, index): [string, number[]] => [
        store.config.lexicon.length > index ? store.config.lexicon[index].phon : '',
        row,
      ]);
      // sort associated array descending by max value of row
      data.sort((a, b) => Math.max(...b[1]) - Math.max(...a[1]));
      // take top 10 values
      return data.slice(0, 10);
    });
    const words = computed(() => topData.value.map(([word, row]) => word));
    const chartData = computed(() => topData.value.map(([word, row]) => row));

    return {
      store,
      chartData,
      yLabelCallback(_: any, index: number) {
        if (index < words.value.length) {
          return words.value[index];
        } else if (index < store.config.lexicon.length) {
          return store.config.lexicon[index].phon;
        }
        return null;
      },
    };
  },
});
</script>
