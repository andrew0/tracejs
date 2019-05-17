<template>
  <div id="app">
    <div style="flex: 0 1 auto; margin: 0.5rem;">
      <!--<textarea v-model="config" style="width: 300px; height: 150px;" />-->
      <a class="button" @click="run">Run</a>

      <span style="margin-left: 2rem;">
        layer:
        <div class="select">
          <select v-model="layer">
            <option value="input">input</option>
            <option value="feature">feature</option>
            <option value="phoneme">phoneme</option>
            <option value="word">word</option>
            <option value="analysis">analysis</option>
            <option value="analysischart">analysis (chart)</option>
          </select>
        </div>
      </span>

      <span v-if="!layer.startsWith('analysis')" style="margin-left: 2rem;">
        cycle:
        <a class="button" @click="cycle = clamp(cycle - 1, 0, numCycles - 1)">-</a>
        <div class="select">
          <select v-model="cycle">
            <option v-for="(n, index) in numCycles" :key="index" :value="index">{{ index }}</option>
          </select>
        </div>
        <a class="button" @click="cycle = clamp(cycle + 1, 0, numCycles - 1)">+</a>
      </span>
    </div>

    <pre v-if="layer != 'analysischart'" style="flex: 1 1 auto; margin: 0; background: #eee; width: 100%; overflow: scroll;">{{ dat }}</pre>
    <div v-else style="flex: 1 1 auto; display: flex; min-height: 0;">
      <chart :chart-data="chartData" class="wrapper" />
    </div>
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
import { TraceSim, createDefaultConfig, doSimAnalysis, TraceDomain, TraceWatchType, TraceCalculationType, TraceChoice } from 'tracejs'
import Chart from './components/Chart.vue'

const chartColors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#000000']

export default {
  name: 'app',
  data() {
    return {
      layer: 'analysischart',
      cycle: -1,
      numCycles: 0,
      analysis: [],
      chartData: { datasets: [] }
    }
  },
  created() {
    // create the sim here, and not in data, because we don't want Vue to watch the data changes
    const config = createDefaultConfig()
    config.modelInput = '-gradu^l-'
    config.decay.W = 0.03
    this.sim = new TraceSim(config)
  },
  computed: {
    dat() {
      if (this.cycle < 0 || this.numCycles <= this.cycle)
        return ''

      switch (this.layer) {
        case 'input':
          return this.sim.inputLayer[this.cycle]
            .map((row, index) => [index, ...row.map(x => x.toFixed(4))].join('\t'))
            .join('\n')
        case 'feature':
          return this.sim.featLayer[this.cycle]
            .map((row, index) => [index, ...row.map(x => x.toFixed(4))].join('\t'))
            .join('\n')
        case 'phoneme':
          return this.sim.phonLayer[this.cycle]
            .map((row, index) => [this.sim.phonemes && this.sim.phonemes.byIndex(index).label, ...row.map(x => x.toFixed(4))].join('\t'))
            .join('\n')
        case 'word':
          return this.sim.wordLayer[this.cycle]
            .map((row, index) => [this.sim.config.lexicon[index].phon, ...row.map(x => x.toFixed(4))].join('\t'))
            .join('\n')
        case 'analysis':
          return [
            ['cycle', ...this.chartData.datasets.map(x => x.label.padEnd(18))].join('\t'),
            ...Array.from(Array(this.numCycles), (_, cycle) => [
              cycle,
              ...this.chartData.datasets.map(x => x.data[cycle].y)
            ].join('\t'))
          ].join('\n')
        default:
          return ''
      }
    }
  },
  methods: {
    run() {
      console.time('trace.js')

      this.sim.cycle(60)
      this.numCycles = this.sim.getStepsRun()
      this.cycle = this.clamp(this.cycle, 0, this.numCycles)

      this.chartData = {
        datasets: doSimAnalysis(this.sim, TraceDomain.WORDS, TraceWatchType.WATCHTOPN, [], 10, TraceCalculationType.STATIC, 4, TraceChoice.FORCED, 4)
          .map((x, idx) => ({
            ...x,
            fill: false,
            borderColor: chartColors[idx],
            showLine: true
          }))
      }

      console.timeEnd('trace.js')
    },
    clamp(num, min, max) {
      return Math.min(Math.max(num, min), max)
    }
  },
  components: { Chart }
}
</script>

<style>
body, html {
  margin: 0;
  height: 100%;
}
#app {
  height: 100%;
  display: flex;
  flex-flow: column;
}
.wrapper {
  position: relative;
  flex: 1;
  width: 100%;
  min-height: 0;
  min-width: 0;
}
</style>
