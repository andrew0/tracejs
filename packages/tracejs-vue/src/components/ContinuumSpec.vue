<template>
  <div class="field is-horizontal" style="width: 30rem;">
    <div class="field-label">
      <label class="label" style="width: 10rem;">Continuum Spec</label>
    </div>
    <div class="field-body">
      <label class="checkbox" style="margin-right: 10px;">
        <input type="checkbox" v-model="enabled" />
        Enabled
      </label>

      <div class="field" style="margin-right: 10px;">
        <input class="input" type="number" v-model="steps" min="0" :disabled="!enabled" />
        <p class="help is-info">Number of steps</p>
      </div>

      <div class="select" style="margin-right: 10px;">
        <select v-model="from" :disabled="!enabled">
          <option v-for="(label, index) in sortedPhons" :key="index">
            {{ label }}
          </option>
        </select>
        <p class="help is-info">From phoneme</p>
      </div>

      <div class="select">
        <select v-model="to" :disabled="!enabled">
          <option v-for="(label, index) in sortedPhons" :key="index">
            {{ label }}
          </option>
        </select>
        <p class="help is-info">To phoneme</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['config'],
  data() {
    const spec = this.config.continuumSpec || '';
    return {
      enabled: false,
      from: spec[0] || '',
      to: spec[1] || '',
      steps: parseInt(spec[2], 10) || 1,
    };
  },
  mounted() {
    this.to = this.to || this.sortedPhons[0];
    this.from = this.from || this.sortedPhons[1];
  },
  watch: {
    compiledSpec(val) {
      this.config.continuumSpec = val;
    },
  },
  computed: {
    compiledSpec() {
      if (!this.enabled || !this.from || !this.to) {
        return '';
      }
      return `${this.from}${this.to}${this.steps}`;
    },
    sortedPhons() {
      return this.config.phonology.map((phon) => phon.label).sort();
    },
  },
}
</script>
