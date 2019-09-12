<template>
  <simulation-chart
    :chart-data="chartDataFiltered"
    chart-title="Word Activations"
    x-axis-title="Temporal Alignment"
    y-axis-title="Word"
    :y-label-callback="yLabelCallback"
    :num-x-ticks="33"
    :num-y-ticks="10"
    :y-step-size="1" />
</template>

<script>
import SimulationChart from './SimulationChart.vue'

export default {
  props: {
    chartData: {
      type: Array,
      default: () => []
    },
    words: Array
  },
  data() {
    return {
      wordsFiltered: [],
      chartDataFiltered: []
    }
  },
  watch: {
    chartData: {
      immediate: true,
      handler(val) {
        const data = val.map((row, index) => [this.words.length > index ? this.words[index].phon : '', row])
        data.sort((a, b) => Math.max(...b[1]) - Math.max(...a[1]))
        this.wordsFiltered = data.map(([word, row]) => word).slice(0, 10)
        this.chartDataFiltered = data.map(([word, row]) => row).slice(0, 10)
      }
    }
  },
  methods: {
    yLabelCallback(value, index) {
      if (index < this.wordsFiltered.length) {
        return this.wordsFiltered[index]
      }
      return null
    }
  },
  components: { SimulationChart }
}
</script>
