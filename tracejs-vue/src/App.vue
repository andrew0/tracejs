<template>
  <div id="app">
    <div style="flex: 0 1 auto; margin: 0.5rem;">
      <!--<textarea v-model="config" style="width: 300px; height: 150px;" />-->
      <a class="button" @click="run">Run</a>

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
          </select>
        </div>
      </span>
    </div>

    <pre style="flex: 1 1 auto; margin: 0; background: #eee; width: 100%; overflow: scroll;">{{ dat }}</pre>
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
import { TraceNet, createDefaultConfig } from 'tracejs'

/** creates a copy of a 2D array */
const copy2D = arr => arr.map(x => [...x])

export default {
  name: 'app',
  data() {
    const config = createDefaultConfig()
    config.modelInput = '-gradu^l-'
    config.decay.W = 0.03
    return {
      config,
      phonemes: null,
      layer: 'input',
      cycle: -1,
      numCycles: 0,
      inputLayer: [],
      featLayer: [],
      phonLayer: [],
      wordLayer: []
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
          return this.inputLayer[this.cycle]
            .map((row, index) => [index, ...row.map(x => x.toFixed(4))].join('\t'))
            .join('\n')
        case 'feature':
          return this.featLayer[this.cycle]
            .map((row, index) => [index, ...row.map(x => x.toFixed(4))].join('\t'))
            .join('\n')
        case 'phoneme':
          return this.phonLayer[this.cycle]
            .map((row, index) => [this.phonemes && this.phonemes.charAt(index), ...row.map(x => x.toFixed(4))].join('\t'))
            .join('\n')
        case 'word':
          return this.wordLayer[this.cycle]
            .map((row, index) => [this.config.lexicon[index].phon, ...row.map(x => x.toFixed(4))].join('\t'))
            .join('\n')
        default:
          return ''
      }
    }
  },
  methods: {
    run() {
      this.inputLayer = []
      this.featLayer = []
      this.phonLayer = []
      this.wordLayer = []

      const tn = new TraceNet(this.config)
      this.phonemes = tn.phonemes
      //this.tn.reset()
      tn.createInput()
      for (let i = 0; i < 60; i++) {
        this.inputLayer[this.numCycles] = copy2D(tn.inputLayer)
        this.featLayer[this.numCycles] = copy2D(tn.featLayer)
        this.phonLayer[this.numCycles] = copy2D(tn.phonLayer)
        this.wordLayer[this.numCycles] = copy2D(tn.wordLayer)
        this.numCycles += 1
        tn.cycle()
      }

      this.cycle = 0
    },
    clamp(num, min, max) {
      return Math.min(Math.max(num, min), max)
    }
  }
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
