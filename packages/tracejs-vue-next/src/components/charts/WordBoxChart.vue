<template>
  <BoxChart
    :chart-data="chartData"
    chart-title="Word Activations"
    x-axis-title="Temporal Alignment"
    y-axis-title="Activation Magnitude"
    :num-x-ticks="Math.ceil(store.config.fSlices / store.config.slicesPerPhon) + 1"
    :sim-config="store.config"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

// @ts-ignore
import BoxChart from './BoxChart';
import { getStore } from '../../store';

export default defineComponent({
  components: { BoxChart },
  setup() {
    const store = getStore();
    return {
      store,
      chartData: computed(() => {
        // jTRACE doesn't limit the data to top 10 in word box chart, but I'm doing it here
        // because iterating through thousands of values is a big performance hit

        const rawData = store.sim.value?.wordLayer[store.currentCycle.value] || [];
        const { min, max } = store.config;
        const threshold = (max - min) * 0.01;

        // associate each word with corresponding row in an array [word, row]
        const data = rawData.map((row, index): [string, number[]] => [
          store.config.lexicon.length > index ? store.config.lexicon[index].phon : '',
          row,
        ]);
        // sort associated array descending by max value of row
        data.sort((a, b) => Math.max(...b[1]) - Math.max(...a[1]));
        // take top 10 values
        const topData = data.slice(0, 10);

        const chartData = [];
        for (const [word, row] of topData) {
          let lastValue = Number.NEGATIVE_INFINITY;
          for (let col = 0; col < row.length; col++) {
            const value = row[col];
            const nextValue = col + 1 < row.length ? row[col + 1] : Number.NEGATIVE_INFINITY;
            if (value > lastValue && value > nextValue && value > threshold) {
              // rescale the activation value
              const rescaled = (value - min) / (max - min);
              chartData.push({
                x: col,
                y: rescaled,
                word,
              });
            }
            lastValue = value;
          }
        }

        return chartData;
      }),
    };
  },
});
</script>
