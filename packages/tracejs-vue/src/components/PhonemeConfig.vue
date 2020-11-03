<template>
  <div>
    <div style="display: flex; margin-bottom: 1rem;">
      <file-upload @load="loadJtPhonology" style="margin-right: 0.5rem;" />
      <a class="button" @click="savePhonology">Save lexicon</a>
    </div>
    <div class="columns">
      <div class="column is-2">
        <div class="list is-hoverable">
          <a
            v-for="(phoneme, index) in sortedPhonemes"
            :key="index"
            :class="{ 'list-item': true, 'is-active': phoneme === activePhoneme }"
            @click="activePhoneme = phoneme">
            {{ phoneme.label || 'null' }}
          </a>
        </div>
        <a class="button" @click="addPhoneme">Add phoneme</a>
        <a class="button" @click="deleteSelected">Delete selected</a>
      </div>
      <div v-if="activePhoneme" class="column">
        <div class="field is-horizontal" style="width: 8rem;">
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
                <input class="borderless-input" style="width: 5rem;" type="text" v-model="activePhoneme.features[contIndex * numFeatures + featIndex]" />
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
                <input class="borderless-input" style="width: 5rem;" type="text" v-model="activePhoneme.durationScalar[contIndex]" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from './FileUpload.vue'
import { createDefaultPhoneme, parseJtPhonology, serializeJtPhonology } from 'tracejs'
import FileSaver from 'file-saver'

export default {
  components: { FileUpload },
  props: {
    phonemes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      continua: [
        'POW', 'VOC', 'DIF', 'ACU', 'GRD', 'VOI', 'BUR'
      ],
      numFeatures: 9,
      activePhoneme: null
    }
  },
  created() {
    this.activePhoneme = this.sortedPhonemes[0]
  },
  methods: {
    deleteSelected() {
      const index = this.phonemes.indexOf(this.activePhoneme)
      const sortedIndex = this.sortedPhonemes.indexOf(this.activePhoneme)
      if (index >= 0) {
        this.phonemes.splice(index, 1)
        this.activePhoneme = this.sortedPhonemes[Math.min(sortedIndex, this.sortedPhonemes.length - 1)]
      }
    },
    addPhoneme() {
      const phoneme = createDefaultPhoneme()
      this.phonemes.push(phoneme)
      this.activePhoneme = phoneme
    },
    loadJtPhonology(xmlText) {
      // replace the configuration in place
      this.phonemes.splice(0, this.phonemes.length, ...parseJtPhonology(xmlText))
    },
    savePhonology() {
      const blob = new Blob([serializeJtPhonology(this.phonemes)], {type: 'application/xml'})
      FileSaver.saveAs(blob, 'phonology.jt')
    },
  },
  computed: {
    sortedPhonemes() {
      // we create copy before sorting because vue doesn't like side effects in computed props
      // the v-model will still update the original value, because the copied array contains
      // references to the same phoneme objects in the original array
      return [...this.phonemes].sort((a, b) => a.label.localeCompare(b.label))
    }
  }
}
</script>
