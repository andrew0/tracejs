<template>
  <simulation-chart
    :chart-data="chartData"
    chart-title="Feature Activations"
    x-axis-title="Temporal Alignment"
    y-axis-title="Feature Continua"
    :y-label-callback="yLabelCallback"
    :num-x-ticks="simConfig.fSlices + 1"
    :num-y-ticks="63"
    :y-step-size="9"
    :sim-config="simConfig" />
</template>

<script>
import SimulationChart from './SimulationChart.vue'

export default {
  props: {
    chartData: Array,
    simConfig: Object
  },
  methods: {
    yLabelCallback(value, index) {
      const labels = ['POW', 'VOC', 'DIF', 'ACU', 'GRD', 'VOI', 'BUR']
      if (index < labels.length) {
        return labels[index]
      }
      return null
    } 
  },
  components: { SimulationChart }
}
</script>
