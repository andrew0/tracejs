<template>
  <BoxChart
    :chart-data="chartData"
    chart-title="Phoneme Activations"
    x-axis-title="Temporal Alignment"
    y-axis-title="Activation Magnitude"
    :num-x-ticks="Math.ceil(store.config.fSlices / store.config.slicesPerPhon) + 1"
    :sim-config="store.config"
    :border-width="0"
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
        const rawData = store.sim.value?.phonLayer[store.currentCycle.value] || [];
        const { min, max } = store.config;
        const threshold = (max - min) * 0.02;

        const data = [];
        for (const [index, row] of rawData.entries()) {
          for (let col = 0; col < row.length - 1; col++) {
            const value = row[col];
            const nextValue = row[col + 1];
            if (value > nextValue && value > threshold) {
              // rescale the activation value
              const rescaled = (value - min) / (max - min);
              data.push({
                x: col,
                y: rescaled,
                word:
                  store.sortedPhonemes.value.length > index
                    ? store.sortedPhonemes.value[index].label
                    : '?',
              });
            }
          }
        }

        return data;
      }),
    };
  },
});
</script>
