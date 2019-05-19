<template>
  <div id="app">
    <div style="flex: 0 1 auto;">
      <section class="hero is-primary" style="padding: 0.5rem 1rem 0 1rem;">
        <div class="hero-foot">
          <nav class="tabs is-boxed">
            <ul>
              <li v-for="(tab, index) in tabs" :key="index" :class="{ 'is-active': activeTab == index }">
                <a @click="activeTab = index">{{ tab }}</a>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      <section v-if="activeTab != 0" style="padding: 0.5rem;">
        <a class="button" @click="run">Run</a>

        <span v-if="[1, 2 , 3, 4].indexOf(activeTab) >= 0" style="margin-left: 2rem;">
          cycle:
          <a class="button" @click="cycle = clamp(cycle - 1, 0, numCycles - 1)">-</a>
          <div class="select">
            <select v-model="cycle">
              <option v-for="(n, index) in numCycles" :key="index" :value="index">{{ index }}</option>
            </select>
          </div>
          <a class="button" @click="cycle = clamp(cycle + 1, 0, numCycles - 1)">+</a>
        </span>
      </section>
    </div>

    <div v-if="activeTab == 0" style="display: flex; flex: 1 1 auto;">
      <config :config="config" />
    </div>
    <div v-else-if="activeTab == 6" style="display: flex; flex: 1 1 auto; min-height: 0;">
      <analysis :chart-data="chartData" :config="analysisConfig" />
    </div>
    <pre v-else style="flex: 1 1 auto; margin: 0; background: #eee; width: 100%; overflow: scroll;">{{ dat }}</pre>
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
import { TraceSim, createDefaultConfig, doSimAnalysis, TraceDomain, TraceCalculationType, TraceChoice } from 'tracejs'
import Config from './components/Config.vue'
import Analysis from './components/Analysis.vue'

const chartColors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#000000']

export default {
  name: 'app',
  data() {
    return {
      tabs: ['Config', 'Input', 'Feature', 'Phoneme', 'Word', 'Analysis', 'Analysis (Chart)'],
      activeTab: 0,
      config: createDefaultConfig(),
      analysisConfig: {
        domain: TraceDomain.WORDS,
        itemsToWatch: 10,
        calculationType: TraceCalculationType.STATIC,
        alignment: 4,
        choice: TraceChoice.NORMAL,
        kValue: 0
      },
      cycle: -1,
      numCycles: 0,
      analysis: [],
      chartData: { datasets: [] }
    }
  },
  created() {
    // create the sim here, and not in data, because we don't want Vue to watch the data changes
    // this.config.modelInput = '-gradu^l-'
    // this.config.decay.W = 0.03
    this.sim = new TraceSim(JSON.parse(JSON.stringify(this.config)))
  },
  computed: {
    dat() {
      if (!this.sim || this.cycle < 0 || this.numCycles <= this.cycle)
        return ''

      switch (this.activeTab) {
        case 1:
          return this.sim.inputLayer[this.cycle]
            .map((row, index) => [index, ...row.map(x => x.toFixed(4))].join('\t'))
            .join('\n')
        case 2:
          return this.sim.featLayer[this.cycle]
            .map((row, index) => [index, ...row.map(x => x.toFixed(4))].join('\t'))
            .join('\n')
        case 3:
          return this.sim.phonLayer[this.cycle]
            .map((row, index) => [this.sim.phonemes && this.sim.phonemes.byIndex(index).label, ...row.map(x => x.toFixed(4))].join('\t'))
            .join('\n')
        case 4:
          return this.sim.wordLayer[this.cycle]
            .map((row, index) => [this.sim.config.lexicon[index].phon, ...row.map(x => x.toFixed(4))].join('\t'))
            .join('\n')
        case 5:
          return this.analysisData
        default:
          return ''
      }
    },
    analysisData() {
      return [
        ['cycle', ...this.chartData.datasets.map(x => x.label.padEnd(18))].join('\t'),
        ...Array.from(Array(this.numCycles), (_, cycle) => [
          cycle,
          ...this.chartData.datasets.map(x => x.data[cycle].y.toFixed(18))
        ].join('\t'))
      ].join('\n')
    }
  },
  methods: {
    run() {
      // eslint-disable-next-line
      console.time('trace.js')
      this.sim = new TraceSim(JSON.parse(JSON.stringify(this.config)))

      this.sim.cycle(60)
      this.numCycles = this.sim.getStepsRun()
      this.cycle = this.clamp(this.cycle, 0, this.numCycles)

      const simConfig = {
        sim: this.sim,
        domain: TraceDomain.WORDS,
        itemsToWatch: 10,
        calculationType: TraceCalculationType.STATIC,
        alignment: 4,
        choice: TraceChoice.NORMAL,
        kValue: 0
      }
      this.chartData = {
        datasets: doSimAnalysis({
          ...this.analysisConfig,
          sim: this.sim
        })
          .map((x, idx) => ({
            ...x,
            fill: false,
            borderColor: chartColors[idx],
            showLine: true
          }))
      }

      // eslint-disable-next-line
      console.timeEnd('trace.js')
    },
    clamp(num, min, max) {
      return Math.min(Math.max(num, min), max)
    }
  },
  components: { Config, Analysis }
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
</style>
