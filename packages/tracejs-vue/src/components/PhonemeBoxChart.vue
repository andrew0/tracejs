<template>
  <box-chart
    :chart-data="chartDataFiltered"
    chart-title="Phoneme Activations"
    x-axis-title="Temporal Alignment"
    y-axis-title="Activation Magnitude"
    :num-x-ticks="Math.ceil(simConfig.fSlices / simConfig.slicesPerPhon) + 1"
    :sim-config="simConfig"
    :border-width="0" />
</template>

<script>
import BoxChart from './BoxChart.vue'

export default {
  props: {
    chartData: Array,
    simConfig: Object,
    phonemes: Array
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
        const { min, max } = this.simConfig
        const threshold = (max - min) * 0.02

        const data = []
        for (const [index, row] of val.entries()) {
          for (let col = 0; col < row.length - 1; col++) {
            const value = row[col]
            const nextValue = row[col + 1]
            if (value > nextValue && value > threshold) {
              // rescale the activation value
              const rescaled = (value - min) / (max - min)
              data.push({
                x: col,
                y: rescaled,
                word: this.phonemes.length > index ? this.phonemes[index].label : '?'
              })
            }
          }
        }

        this.chartDataFiltered = data
      }
    }
  },
  components: { BoxChart }
}
</script>
