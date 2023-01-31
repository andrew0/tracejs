<template>
  <div style="margin: 1rem">
    <div class="notification is-danger" v-if="errors.length">
      <button class="delete" @click="clearErrors"></button>
      <span v-for="err in errors">{{ err }}</span>
    </div>
    <div style="display: flex; margin-bottom: 1rem">
      <file-upload @load="loadJtPhonology" style="margin-right: 0.5rem" label="Load from XML" />
      <button class="button" @click="savePhonology" style="margin-right: 0.5rem">Save XML</button>
      <file-upload @load="loadJsonPhonology" style="margin-right: 0.5rem" label="Load from JSON" />
      <button class="button" @click="saveJsonPhonology">Save JSON</button>
    </div>
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
import FileSaver from 'file-saver';
import {
  createDefaultPhoneme,
  parseJsonPhonology,
  parseJtPhonology,
  serializeJtPhonology,
} from 'tracejs';
import { defineComponent, ref, watch } from 'vue';
import FileUpload from '../../components/FileUpload.vue';
import { CONTINUA, NUM_FEATURES } from '../../constants';
import { getStore } from '../../store';

export default defineComponent({
  name: 'PhonologyTab',
  components: { FileUpload },
  setup() {
    const store = getStore();

    const errors = ref<string[]>([]);
    const clearErrors = () => errors.value.splice(0, errors.value.length);

    const sortedPhonemes = store.sortedPhonemes;
    const activePhoneme = ref(sortedPhonemes.value[0]);

    const addPhoneme = () => {
      const phoneme = createDefaultPhoneme({
        continuaPerFeature: CONTINUA.length,
        numFeatures: NUM_FEATURES,
      });
      store.config.phonology.push(phoneme);
      activePhoneme.value = phoneme;
    };
    const deleteSelected = () => {
      const index = store.config.phonology.indexOf(activePhoneme.value);
      const sortedIndex = sortedPhonemes.value.indexOf(activePhoneme.value);
      if (index >= 0) {
        store.config.phonology.splice(index, 1);
        activePhoneme.value =
          sortedPhonemes.value[Math.min(sortedIndex, sortedPhonemes.value.length - 1)];
      }
    };

    // If the config gets replaced and the active phoneme no longer exists, try
    // to find the active phoneme with the same label. Otherwise, pick the first
    // phoneme.
    watch(
      () => sortedPhonemes.value,
      () => {
        if (!sortedPhonemes.value.includes(activePhoneme.value)) {
          activePhoneme.value =
            sortedPhonemes.value.find((phoneme) => phoneme.label === activePhoneme.value.label) ??
            sortedPhonemes.value[0];
        }
      },
      { deep: true }
    );

    return {
      errors,
      clearErrors,
      continua: CONTINUA,
      numFeatures: NUM_FEATURES,
      sortedPhonemes,
      activePhoneme,
      addPhoneme,
      deleteSelected,
      loadJtPhonology(xmlText: string) {
        store.config.phonology.splice(
          0,
          store.config.phonology.length,
          ...parseJtPhonology(xmlText)
        );
      },
      savePhonology() {
        const blob = new Blob([serializeJtPhonology(store.config.phonology)], {
          type: 'application/xml',
        });
        FileSaver.saveAs(blob, 'phonology.jt');
      },
      loadJsonPhonology(text: string) {
        try {
          store.config.phonology.splice(
            0,
            store.config.phonology.length,
            ...parseJsonPhonology(JSON.parse(text))
          );
        } catch (err: any) {
          if (err.errors) {
            errors.value.splice(0, errors.value.length, ...err.errors);
          } else {
            errors.value.splice(0, errors.value.length, err.message);
          }
        }
      },
      saveJsonPhonology() {
        const blob = new Blob([JSON.stringify(store.config.phonology, null, 2) + '\n'], {
          type: 'application/json',
        });
        FileSaver.saveAs(blob, 'phonology.json');
      },
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
