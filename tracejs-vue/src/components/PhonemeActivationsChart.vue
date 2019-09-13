<template>
  <simulation-chart
    :chart-data="chartData"
    chart-title="Phoneme Activations"
    x-axis-title="Temporal Alignment"
    y-axis-title="Phoneme"
    :y-label-callback="yLabelCallback"
    :num-x-ticks="Math.ceil(simConfig.fSlices / simConfig.slicesPerPhon) + 1"
    :num-y-ticks="phonemes.length"
    :y-step-size="1"
    :sim-config="simConfig" />
</template>

<script>
import SimulationChart from './SimulationChart.vue'

export default {
  props: {
    chartData: Array,
    simConfig: Object,
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
