<template>
  <div id="app">
    <div style="flex: 0 1 auto; margin: 0.5rem;">
      <!--<textarea v-model="config" style="width: 300px; height: 150px;" />-->
      <a class="button" @click="run">Run</a>

      <a class="button" @click="analyze">Analyze</a>

      <span style="margin-left: 2rem; margin-right: 2rem;">
        cycle:
        <a class="button" @click="cycle = clamp(cycle - 1, 0, numCycles - 1)">-</a>
        <div class="select">
          <select v-model="cycle">
            <option v-for="(n, index) in numCycles" :key="index" :value="index">{{ index }}</option>
          </select>
        </div>
        <a class="button" @click="cycle = clamp(cycle + 1, 0, numCycles - 1)">+</a>
      </span>

      <span>
        layer:
        <div class="select">
          <select v-model="layer">
            <option value="input">input</option>
            <option value="feature">feature</option>
            <option value="phoneme">phoneme</option>
            <option value="word">word</option>
            <option value="analysis">analysis</option>
          </select>
        </div>
      </span>
    </div>

    <pre v-if="layer != 'analysis'" style="flex: 1 1 auto; margin: 0; background: #eee; width: 100%; overflow: scroll;">{{ dat }}</pre>
    <div v-else style="flex: 1 1 auto; display: flex;">
      <chart :datasets="analysis" class="wrapper" />
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
    const config = createDefaultConfig()
    config.modelInput = '-gradu^l-'
    config.decay.W = 0.03
    return {
      sim: new TraceSim(config),
      layer: 'input',
      cycle: -1,
      numCycles: 0,
      analysis: []
    }
  },
  created() {
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
        default:
          return ''
      }
    }
  },
  methods: {
    run() {
      this.sim.cycle(60)
      this.numCycles = this.sim.getStepsRun()
      this.cycle = 0
    },
    analyze() {
      this.analysis = doSimAnalysis(this.sim, TraceDomain.WORDS, TraceWatchType.WATCHTOPN, [], 10, TraceCalculationType.STATIC, 4, TraceChoice.FORCED, 4)
        .map((x, idx) => ({
          ...x,
          fill: false,
          borderColor: chartColors[idx],
          showLine: true
        }))
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
}
</style>
