<template>
  <div class="columns">
    <div class="column is-2">
      <div class="list is-hoverable">
        <a
          v-for="(phoneme, index) in sortedPhonemes"
          :key="index"
          :class="{ 'list-item': true, 'is-active': phoneme === activePhoneme }"
          @click="activePhoneme = phoneme">
          {{ phoneme.label }}
        </a>
      </div>
      <a class="button">Add phoneme</a>
      <a class="button">Delete selected</a>
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
              <input class="borderless-input" type="text" v-model="activePhoneme.features[contIndex * numFeatures + featIndex]" />
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
              <input class="borderless-input" type="text" v-model="activePhoneme.durationScalar[contIndex]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    phonemes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      continua: [
        'BUR', 'VOI', 'GRD', 'ACU', 'DIF', 'VOC', 'POW'
      ],
      numFeatures: 9,
      activePhoneme: null
    }
  },
  created() {
    this.activePhoneme = this.sortedPhonemes[0]
  },
  computed: {
    sortedPhonemes() {
      return this.phonemes.sort((a, b) => a.label.localeCompare(b.label))
    }
  }
}
</script>
