<template>
  <simulation-chart
    :chart-data="chartDataFiltered"
    chart-title="Word Activations"
    x-axis-title="Temporal Alignment"
    y-axis-title="Word"
    :y-label-callback="yLabelCallback"
    :num-x-ticks="Math.ceil(simConfig.fSlices / simConfig.slicesPerPhon) + 1"
    :num-y-ticks="10"
    :y-step-size="1"
    :sim-config="simConfig" />
</template>

<script>
import SimulationChart from './SimulationChart.vue'

export default {
  props: {
    chartData: Array,
    simConfig: Object
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
        // associate each word with corresponding row in an array [word, row]
        const data = val.map((row, index) => [this.simConfig.lexicon.length > index ? this.simConfig.lexicon[index].phon : '', row])
        // sort associated array descending by max value of row
        data.sort((a, b) => Math.max(...b[1]) - Math.max(...a[1]))
        // take top 10 values
        const topData = data.slice(0, 10)
        // extract words/rows
        this.wordsFiltered = topData.map(([word, row]) => word)
        this.chartDataFiltered = topData.map(([word, row]) => row)
      }
    }
  },
  methods: {
    yLabelCallback(value, index) {
      if (index < this.wordsFiltered.length) {
        return this.wordsFiltered[index]
      } else if (index < this.simConfig.lexicon.length) {
        return this.simConfig.lexicon[index].phon
      }
      return null
    }
  },
  components: { SimulationChart }
}
</script>
