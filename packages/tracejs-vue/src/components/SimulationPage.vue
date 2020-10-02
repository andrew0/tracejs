<template>
  <div class="grid2x2">
    <div class="grid-box"><feature-activations-chart :chart-data="featureData" :sim-config="simConfig" class="chart-wrapper" /></div>
    <div class="grid-box">
      <word-box-chart v-if="visualize" :chart-data="wordData" :sim-config="simConfig"  class="chart-wrapper" />
      <word-activations-chart v-else :chart-data="wordData" :sim-config="simConfig"  class="chart-wrapper" />
    </div>
    <div class="grid-box"><model-input-chart :chart-data="inputData" :sim-config="simConfig" class="chart-wrapper" /></div>
    <div class="grid-box">
      <phoneme-box-chart v-if="visualize" :chart-data="phonemeData" :sim-config="simConfig" :phonemes="phonemes" class="chart-wrapper" />
      <phoneme-activations-chart v-else :chart-data="phonemeData" :sim-config="simConfig" :phonemes="phonemes" class="chart-wrapper" />
    </div>
  </div>
</template>

<script>
import WordBoxChart from './WordBoxChart.vue'
import PhonemeBoxChart from './PhonemeBoxChart.vue'
import FeatureActivationsChart from './FeatureActivationsChart.vue'
import WordActivationsChart from './WordActivationsChart.vue'
import ModelInputChart from './ModelInputChart.vue'
import PhonemeActivationsChart from './PhonemeActivationsChart.vue'

export default {
  props: {
    simConfig: Object,
    phonemes: Array,
    featureData: Array,
    wordData: Array,
    inputData: Array,
    phonemeData: Array,
    visualize: Boolean
  },
  components: { WordBoxChart, PhonemeBoxChart, FeatureActivationsChart, WordActivationsChart, ModelInputChart, PhonemeActivationsChart }
}
</script>

<style>
.grid2x2 {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  flex-direction: row;
  min-width: 0;
  min-height: 0;
}

.grid-box {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-basis: 50%;
  justify-content: center;
  flex-direction: column;
}

.chart-wrapper {
  position: relative;
  min-height: 0;
  min-width: 0;
}
</style>

