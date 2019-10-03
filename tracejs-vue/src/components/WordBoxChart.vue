<template>
  <box-chart
    :chart-data="chartDataFiltered"
    chart-title="Word Activations"
    x-axis-title="Temporal Alignment"
    y-axis-title="Activation Magnitude"
    :num-x-ticks="Math.ceil(simConfig.fSlices / simConfig.slicesPerPhon) + 1"
    :sim-config="simConfig" />
</template>

<script>
import BoxChart from './BoxChart.vue'

export default {
  props: {
    chartData: Array,
    simConfig: Object
  },
  data() {
    return {
      chartDataFiltered: []
    }
  },
  watch: {
    chartData: {
      immediate: true,
      handler(val) {
        // jTRACE doesn't limit the data to top 10 in word box chart, but I'm doing it here
        // because iterating through thousands of values is a big performance hit

        const { min, max } = this.simConfig
        const threshold = (max - min) * 0.01

        // associate each word with corresponding row in an array [word, row]
        const data = val.map((row, index) => [this.simConfig.lexicon.length > index ? this.simConfig.lexicon[index].phon : '', row])
        // sort associated array descending by max value of row
        data.sort((a, b) => Math.max(...b[1]) - Math.max(...a[1]))
        // take top 10 values
        const topData = data.slice(0, 10)

        const chartData = []
        for (const [word, row] of topData) {
          let lastValue = Number.NEGATIVE_INFINITY
          for (let col = 0; col < row.length; col++) {
            const value = row[col]
            const nextValue = col + 1 < row.length ? row[col + 1] : Number.NEGATIVE_INFINITY
            if (value > lastValue && value > nextValue && value > threshold) {
              // rescale the activation value
              const rescaled = (value - min) / (max - min)
              chartData.push({
                x: col,
                y: rescaled,
                word
              })
            }
            lastValue = value
          }
        }

        this.chartDataFiltered = chartData
      }
    }
  },
  components: { BoxChart }
}
</script>
