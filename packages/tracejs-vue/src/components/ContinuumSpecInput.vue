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
        <input
          class="input"
          type="number"
          v-model.number="steps"
          min="1"
          max="9"
          :disabled="!enabled"
        />
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

interface ContinuumSpec {
  from: string;
  to: string;
  steps: number;
}

const specToString = (spec: ContinuumSpec) => `${spec.from}${spec.to}${spec.steps}`;

const specFromString = (str: string) =>
  str.length === 3 ? { from: str[0], to: str[1], steps: Number(str[3]) } : undefined;

export default defineComponent({
  name: 'ContinuumSpecInput',
  setup() {
    const store = getStore();
    const enabled = ref(false);
    const existingSpec = specFromString(store.config.continuumSpec);
    const sortedPhons = computed(() => store.sortedPhonemes.value.map((phon) => phon.label));

    const from = ref(existingSpec?.from ?? sortedPhons.value[0]);
    const to = ref(existingSpec?.to ?? sortedPhons.value[1] ?? sortedPhons.value[0]);
    const steps = ref(existingSpec?.steps ?? 1);
    const compiledSpec = computed(() =>
      from.value != null && to.value != null && steps.value != null
        ? specToString({ from: from.value, to: to.value, steps: steps.value })
        : ''
    );

    watchEffect(() => {
      // update the config whenever spec is updated, or it is enabled/disabled
      store.config.continuumSpec = enabled.value ? compiledSpec.value : '';
    });

    return {
      sortedPhons,
      enabled,
      from,
      to,
      steps,
    };
  },
});
</script>
