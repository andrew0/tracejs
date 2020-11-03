<template>
  <section style="padding: 0.5rem;">
    Cycles to Calculate
    <input class="input" type="text" :value="cyclesToRun" @input="$emit('update:cyclesToRun', $event.target.value)" style="width: 50px;" />
    <a class="button" @click="$emit('run')">Calculate</a>

    <span v-if="showCycles" style="margin-left: 2rem;">
      cycle:
      <a class="button" @click="$emit('update:cycle', Math.min(Math.max(cycle - 1, 0), numCycles - 1))">-</a>
      <div class="select">
        <select :value="cycle" @change="$emit('update:cycle', Number($event.target.value))">
          <option v-for="(n, index) in numCycles" :key="index" :value="index">{{ index }}</option>
        </select>
      </div>
      <a class="button" @click="$emit('update:cycle', Math.min(Math.max(cycle + 1, 0), numCycles - 1))">+</a>
      <a style="margin-left: 1rem;" class="button" @click="toggleTimer">{{ timer == null ? 'start animation' : 'stop animation' }}</a>
    </span>

    <span v-if="showChartOptions" style="margin-left: 2rem;">
      <label class="checkbox">
        <input type="checkbox" :checked="visualize" @change="$emit('update:visualize', $event.target.checked)">
        Visualize word/phoneme activations
      </label>
    </span>

    <span v-if="showDownloadButton" class="is-pulled-right">
      <a class="button" @click="$emit('save-data')">Save data</a>
    </span>
  </section>
</template>

<script>
export default {
  props: {
    cycle: Number,
    cyclesToRun: Number,
    numCycles: Number,
    showCycles: Boolean,
    showChartOptions: Boolean,
    showDownloadButton: Boolean,
    visualize: Boolean
  },
  data() {
    return {
      timer: null
    }
  },
  methods: {
    toggleTimer() {
      if (this.timer == null) {
        const fn = () => {
          const newVal = Math.min(Math.max(this.cycle + 1, 0), this.numCycles - 1)
          this.$emit('update:cycle', newVal)
          if (newVal == this.numCycles - 1) {
            clearInterval(this.timer)
            this.timer = null
          }
        }
        this.timer = setInterval(fn, 250)
        fn()
      } else {
        clearInterval(this.timer)
        this.timer = null
      }
    }
  }
}
</script>
