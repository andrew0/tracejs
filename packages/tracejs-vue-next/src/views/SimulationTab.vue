<template>
  <div :class="$style.container">
    <div :class="$style.toolbar">
      <SimulationToolbar show-cycles show-chart-options />
    </div>

    <div :class="$style['input-wrapper']">
      <ConfigInput v-model="config.modelInput" label="Model Input" note="" type="text" />
    </div>

    <div :class="$style.main">
      <div :class="$style.grid">
        <FeatureActivationsChart :class="$style['chart-wrapper']" />
        <WordActivationsChart v-show="!useBoxChart" :class="$style['chart-wrapper']" />
        <WordBoxChart v-show="useBoxChart" :class="$style['chart-wrapper']" />
        <ModelInputChart :class="$style['chart-wrapper']" />
        <PhonemeActivationsChart v-show="!useBoxChart" :class="$style['chart-wrapper']" />
        <PhonemeBoxChart v-show="useBoxChart" :class="$style['chart-wrapper']" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import SimulationToolbar from '../components/SimulationToolbar.vue';
import FeatureActivationsChart from '../components/charts/FeatureActivationsChart.vue';
import WordActivationsChart from '../components/charts/WordActivationsChart.vue';
import WordBoxChart from '../components/charts/WordBoxChart.vue';
import ModelInputChart from '../components/charts/ModelInputChart.vue';
import PhonemeActivationsChart from '../components/charts/PhonemeActivationsChart.vue';
import PhonemeBoxChart from '../components/charts/PhonemeBoxChart.vue';
import ConfigInput from '../components/ConfigInput.vue';
import { getStore } from '../store';

export default defineComponent({
  name: 'SimulationTab',
  components: {
    ConfigInput,
    SimulationToolbar,
    FeatureActivationsChart,
    WordActivationsChart,
    WordBoxChart,
    ModelInputChart,
    PhonemeActivationsChart,
    PhonemeBoxChart,
  },
  setup() {
    const store = getStore();
    return {
      useBoxChart: store.useBoxChart,
      config: store.config,
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
  overflow: auto;
}

.grid {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.chart-wrapper {
  position: relative;
  min-height: 0;
  min-width: 0;
  width: 100%;
  height: 100%;
}

.input-wrapper {
  padding: 0.5rem 0;
}
</style>
