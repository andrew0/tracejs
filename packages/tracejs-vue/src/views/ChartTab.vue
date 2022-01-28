<template>
  <div :class="$style.container">
    <div :class="$style.toolbar">
      <SimulationToolbar />
    </div>

    <div :class="$style.main">
      <div :class="$style.grid">
        <AnalysisConfig />
        <AnalysisChart :chart-data="chartData" :class="$style['chart-wrapper']" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import SimulationToolbar from '../components/SimulationToolbar.vue';
import AnalysisConfig from '../components/AnalysisConfig.vue';
// @ts-ignore
import AnalysisChart from '../components/charts/AnalysisChart';
import { getStore } from '../store';

export default defineComponent({
  name: 'ChartTab',
  components: {
    SimulationToolbar,
    AnalysisConfig,
    AnalysisChart,
  },
  setup() {
    const store = getStore();
    return {
      chartData: computed(() => ({ datasets: store.analysisData.value })),
    };
  },
});
</script>

<style module>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  flex: 0;
  background: white;
  border-bottom: 1px solid #dbdbdb;
}

.main {
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 1rem;
  overflow: auto;
}

.grid {
  height: 100%;
  display: grid;
  grid-template-columns: 15rem 1fr;
}

.chart-wrapper {
  position: relative;
  min-height: 0;
  min-width: 0;
  width: 100%;
  height: 100%;
}
</style>
