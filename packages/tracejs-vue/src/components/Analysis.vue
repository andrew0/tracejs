<template>
  <div style="display: flex; flex: 1; min-width: 0; padding: 1rem;">
    <div style="width: 15rem;">
      <analysis-config :config="config" :sim-config="simConfig" />
    </div>
    <div style="flex-grow: 1; min-width: 0;">
      <chart :chart-data="chartData" class="wrapper" />
    </div>
  </div>
</template>

<script>
import AnalysisConfig from './AnalysisConfig.vue'
import Chart from './Chart.vue'

export default {
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    simConfig: {
      type: Object,
      required: true,
    },
    chartData: {
      type: Object,
      default: () => ({ datasets: [] })
    }
  },
  components: { AnalysisConfig, Chart }
}
</script>

<style>
.wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 0;
  min-width: 0;
}
</style>
