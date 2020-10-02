<template>
  <div>
    <div class="field">
      <label class="label">Analyze</label>
      <div class="control">
        <label class="radio">
          <input type="radio" :value="domainWords" v-model="config.domain">
          Words
        </label>
        <label class="radio">
          <input type="radio" :value="domainPhonemes" v-model="config.domain">
          Phonemes
        </label>
      </div>
    </div>

    <div class="field">
      <label class="label">Content</label>
      <div class="control">
        <div class="select">
          <select v-model="contentType">
            <option :value="contentTypeActivations">Activations</option>
            <option :value="contentTypeResponseProbabilities">Response Probabilities</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TraceDomain, TraceContentType } from 'tracejs'

export default {
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      domainWords: TraceDomain.WORDS,
      domainPhonemes: TraceDomain.PHONEMES,
      contentTypeResponseProbabilities: TraceContentType.RESPONSE_PROBABILITIES,
      contentTypeActivations: TraceContentType.ACTIVATIONS
    }
  },
  computed: {
    contentType: {
      get: function() {
        return this.config.kValue ? TraceContentType.RESPONSE_PROBABILITIES : TraceContentType.ACTIVATIONS
      },
      set: function(val) {
        this.$set(this.config, 'kValue', val == TraceContentType.ACTIVATIONS ? 0 : 4)
      }
    }
  }
}
</script>
