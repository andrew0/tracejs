<template>
  <div class="field is-horizontal" style="width: 30rem">
    <div class="field-label">
      <label class="label" style="width: 10rem">Continuum Spec</label>
    </div>
    <div class="field-body">
      <label class="checkbox" style="margin-right: 10px">
        <input type="checkbox" v-model="enabled" />
        Enabled
      </label>

      <div class="field" style="margin-right: 10px">
        <input class="input" type="number" v-model="steps" min="0" :disabled="!enabled" />
        <p class="help is-info">Number of steps</p>
      </div>

      <div class="select" style="margin-right: 10px">
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

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue';
import { getStore } from '../store';

const replaceAt = (str: string, index: number, replacement: string) =>
  str.substr(0, index) + replacement + str.substr(index + replacement.length);

export default defineComponent({
  name: 'ContinuumSpecInput',
  setup() {
    const store = getStore();
    const enabled = ref(false);
    const compiledSpec = ref(store.config.continuumSpec);
    const from = computed({
      get() {
        return compiledSpec.value[0] || '';
      },
      set(val: string) {
        compiledSpec.value = replaceAt(compiledSpec.value, 0, val);
      },
    });
    const to = computed({
      get() {
        return compiledSpec.value[1] || '';
      },
      set(val: string) {
        compiledSpec.value = replaceAt(compiledSpec.value, 1, val);
      },
    });
    const steps = computed({
      get() {
        return parseInt(compiledSpec.value[2], 10) || 1;
      },
      set(val: number) {
        compiledSpec.value = replaceAt(compiledSpec.value, 0, val.toString());
      },
    });
    watchEffect(() => {
      // update the config whenever spec is updated, or it is enabled/disabled
      store.config.continuumSpec = enabled.value ? compiledSpec.value : '';
    });
    return {
      sortedPhons: computed(() => store.sortedPhonemes.value.map((phon) => phon.label)),
      enabled,
      from,
      to,
      steps,
    };
  },
});
</script>
