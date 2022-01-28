<template>
  <div style="margin: 1rem">
    <!-- <div style="display: flex; margin-bottom: 1rem;">
      <file-upload @load="loadJtPhonology" style="margin-right: 0.5rem;" />
      <a class="button" @click="savePhonology">Save lexicon</a>
    </div> -->
    <div class="columns">
      <div class="column is-2">
        <div class="panel is-hoverable" style="background: white">
          <a
            v-for="(phoneme, index) in sortedPhonemes"
            :key="index"
            :class="{ 'panel-block': true, 'is-active': phoneme === activePhoneme }"
            @click="activePhoneme = phoneme"
          >
            {{ phoneme.label || 'null' }}
          </a>
        </div>
        <a class="button" @click="addPhoneme">Add phoneme</a>
        <a class="button" @click="deleteSelected">Delete selected</a>
      </div>
      <div v-if="activePhoneme" class="column">
        <div class="field is-horizontal" style="width: 8rem">
          <div class="field-label">
            <label class="label">Label</label>
          </div>
          <div class="field-body">
            <input class="input" type="text" v-model="activePhoneme.label" />
          </div>
        </div>

        <h1 class="title is-5 is-marginless">Phoneme Specification</h1>
        <table class="table is-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th v-for="(cont, index) of continua" :key="index">
                {{ cont }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(feat, featIndex) in numFeatures" :key="featIndex">
              <td>{{ feat }}</td>
              <td v-for="(_, contIndex) in continua.length" :key="contIndex" class="is-paddingless">
                <input
                  class="input"
                  style="width: 5rem"
                  type="number"
                  v-model="activePhoneme.features[contIndex * numFeatures + featIndex]"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <h1 class="title is-5 is-marginless">Duration Scalar</h1>
        <table class="table is-bordered">
          <thead>
            <tr>
              <th v-for="(cont, index) of continua" :key="index">
                {{ cont }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="(_, contIndex) in continua.length" :key="contIndex" class="is-paddingless">
                <input
                  class="input"
                  style="width: 5rem"
                  type="number"
                  v-model="activePhoneme.durationScalar[contIndex]"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { createDefaultPhoneme } from 'tracejs';
import { computed, defineComponent, ref } from 'vue';

import { CONTINUA, NUM_FEATURES } from '../../constants';
import { getStore } from '../../store';

export default defineComponent({
  name: 'PhonologyTab',
  setup() {
    const store = getStore();

    const sortedPhonemes = store.sortedPhonemes;
    const activePhoneme = ref(sortedPhonemes.value[0]);

    const addPhoneme = () => {
      const phoneme = createDefaultPhoneme();
      store.config.phonology.push(phoneme);
      activePhoneme.value = phoneme;
    };
    const deleteSelected = () => {
      const index = store.config.phonology.indexOf(activePhoneme.value);
      const sortedIndex = store.config.phonology.indexOf(activePhoneme.value);
      if (index >= 0) {
        store.config.phonology.splice(index, 1);
        activePhoneme.value =
          sortedPhonemes.value[Math.min(sortedIndex, sortedPhonemes.value.length - 1)];
      }
    };

    return {
      continua: CONTINUA,
      numFeatures: NUM_FEATURES,
      sortedPhonemes,
      activePhoneme,
      addPhoneme,
      deleteSelected,
    };
  },
});
</script>

<style scoped>
.panel {
  background: white;
}

.panel-block.is-active {
  background: whitesmoke;
}
</style>
