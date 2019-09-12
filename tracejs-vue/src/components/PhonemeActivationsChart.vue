<template>
  <simulation-chart
    :chart-data="chartData"
    chart-title="Phoneme Activations"
    x-axis-title="Temporal Alignment"
    y-axis-title="Phoneme"
    :y-label-callback="yLabelCallback"
    :num-x-ticks="33"
    :num-y-ticks="phonemes.length"
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
    phonemes: Array
  },
  methods: {
    yLabelCallback(value, index) {
      if (index < this.phonemes.length) {
        return this.phonemes[index].label
      }
      return null
    } 
  },
  components: { SimulationChart }
}
</script>
