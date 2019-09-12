<template>
  <div class="grid2x2">
    <div class="grid-box"><feature-activations-chart :chart-data="featureData" class="chart-wrapper" /></div>
    <div class="grid-box"><word-activations-chart :chart-data="wordData" :words="words" class="chart-wrapper" /></div>
    <div class="grid-box"><model-input-chart :chart-data="inputData" class="chart-wrapper" /></div>
    <div class="grid-box"><phoneme-activations-chart :chart-data="phonemeData" :phonemes="phonemes" class="chart-wrapper" /></div>
  </div>
</template>

<script>
import FeatureActivationsChart from './FeatureActivationsChart.vue'
import WordActivationsChart from './WordActivationsChart.vue'
import ModelInputChart from './ModelInputChart.vue'
import PhonemeActivationsChart from './PhonemeActivationsChart.vue'

export default {
  props: {
    featureData: {
      type: Array,
      default: () => []
    },
    words: {
      type: Array,
      default: () => []
    },
    wordData: {
      type: Array,
      default: () => []
    },
    inputData: {
      type: Array,
      default: () => []
    },
    phonemes: {
      type: Array,
      default: () => []
    },
    phonemeData: {
      type: Array,
      default: () => []
    }
  },
  components: { FeatureActivationsChart, WordActivationsChart, ModelInputChart, PhonemeActivationsChart }
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

