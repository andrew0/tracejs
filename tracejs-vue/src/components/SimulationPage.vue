<template>
  <div class="grid2x2">
    <div class="grid-box"><simulation-chart :featureData="featureData" class="chart-wrapper" /></div>
    <div class="grid-box">two</div>
    <div class="grid-box">three</div>
    <div class="grid-box">four</div>
  </div>
  <!-- <div style="display: flex; flex: 1; min-width: 0;">
    <simulation-chart :featureData="featureData" class="wrapper" />
  </div> -->
</template>

<script>
import SimulationChart from './SimulationChart.vue'

export default {
  props: {
    featureData: {
      type: Array,
      default: () => []
    }
  },
  components: { SimulationChart }
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

