<template>
  <div>
    <div class="field">
      <label class="label">Analyze</label>
      <div class="control">
        <label class="radio">
          <input type="radio" name="domain" :value="domainWords" v-model="config.domain" />
          Words
        </label>
        <label class="radio">
          <input type="radio" name="domain" :value="domainPhonemes" v-model="config.domain" />
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
            <option :value="contentTypeCompetitionIndex">Competition Index</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="shouldShowItems" class="field">
      <label class="label">Items</label>
      <div class="control">
        <label class="radio">
          <input type="radio" name="items" :value="false" v-model="useSpecifiedItems" />
          Use top <input type="number" style="width: 50px" :disabled="useSpecifiedItems" v-model="numItemsToWatch"> items
        </label>
      </div>
      <div class="control">
        <label class="radio">
          <input type="radio" name="items" :value="true" v-model="useSpecifiedItems" />
          Use selected items
        </label>
      </div>
      <div v-if="useSpecifiedItems" class="items-container">
        <div v-for="(word, index) in simConfig.lexicon" :key="index" class="control">
          <label class="checkbox">
            <input type="checkbox" :checked="isWatchingItem(word)" @change="setIsWatchingItem(word, $event.target.checked)">
            {{ word.phon }}
          </label>
        </div>
      </div>
    </div>

    <div v-if="shouldShowAlignmentCalc" class="field">
      <label class="label">Alignment Calculation</label>
      <div v-for="(value, label) in alignments" :key="value" class="control">
        <label class="radio">
          <input type="radio" name="alignment" :value="value" v-model="config.calculationType" />
          {{ label }}
        </label>
      </div>
    </div>

    <div v-if="shouldShowAlignment" class="field">
      <label class="label">Alignment</label>
      <div class="control">
        <input class="input" min="0" type="number" v-model="config.alignment" />
      </div>
    </div>

    <div v-if="shouldShowLuceChoice" class="field">
      <label class="label">Luce Choice</label>
      <div class="control">
        <label class="radio">
          <input type="radio" name="choice" :value="choiceNormal" v-model="config.choice" />
          All Items
        </label>
        <label class="radio">
          <input type="radio" name="choice" :value="choiceForced" v-model="config.choice" />
          Forced Choice
        </label>
      </div>
      <br />
      <label>
        K Value
        <input class="input" min="0" type="number" v-model="config.kValue" style="width: 50px;" />
      </label>
    </div>

    <div v-if="shouldShowCompetIndex" class="field">
      <label class="label">Global Competition Index</label>
      <div class="control">
        <div class="select">
          <select v-model="config.competType">
            <option :value="competTypeRaw">Raw</option>
            <option :value="competTypeFirstDeriv">1st Derivative</option>
            <option :value="competTypeSecondDeriv">2nd Derivative</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="shouldShowCompetSlope" class="field">
      <label class="label">Sampling Width</label>
      <div class="control">
        <input class="input" min="2" type="number" v-model="config.competSlope" />
      </div>
    </div>
  </div>
</template>

<script>
import { TraceDomain, TraceContentType, TraceCalculationType, TraceCompetitionType, TraceChoice } from 'tracejs'

export default {
  props: {
    simConfig: {
      type: Object,
      required: true,
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const itemsToWatch = this.config.itemsToWatch;
    return {
      domainWords: TraceDomain.WORDS,
      domainPhonemes: TraceDomain.PHONEMES,

      contentTypeResponseProbabilities: TraceContentType.RESPONSE_PROBABILITIES,
      contentTypeActivations: TraceContentType.ACTIVATIONS,
      contentTypeCompetitionIndex: TraceContentType.COMPETITION_INDEX,

      competTypeRaw: TraceCompetitionType.RAW,
      competTypeFirstDeriv: TraceCompetitionType.FIRST_DERIVATIVE,
      competTypeSecondDeriv: TraceCompetitionType.SECOND_DERIVATIVE,

      choiceNormal: TraceChoice.NORMAL,
      choiceForced: TraceChoice.FORCED,

      alignments: {
        'Average': TraceCalculationType.AVERAGE,
        'Max (Ad-Hoc)': TraceCalculationType.MAX_ADHOC,
        'Max (Ad-Hoc-2)': TraceCalculationType.MAX_ADHOC_2,
        'Max (Post-Hoc)': TraceCalculationType.MAX_POSTHOC,
        'Specified': TraceCalculationType.STATIC,
        'Frauenfelder (x, x+1)': TraceCalculationType.FRAUENFELDER,
      },

      itemsToWatch: new Set(),
      numItemsToWatch: typeof itemsToWatch === 'number' ? itemsToWatch : 10,
    }
  },
  computed: {
    shouldShowAlignmentCalc() {
      return this.contentType !== TraceContentType.COMPETITION_INDEX;
    },
    shouldShowAlignment() {
      const { calculationType } = this.config;
      return this.shouldShowAlignmentCalc &&
        (calculationType === TraceCalculationType.FRAUENFELDER
          || calculationType === TraceCalculationType.STATIC);
    },
    shouldShowLuceChoice() {
      return this.contentType === TraceContentType.RESPONSE_PROBABILITIES;
    },
    shouldShowItems() {
      return this.contentType !== TraceContentType.COMPETITION_INDEX;
    },
    shouldShowCompetIndex() {
      return this.contentType === TraceContentType.COMPETITION_INDEX;
    },
    shouldShowCompetSlope() {
      return this.shouldShowCompetIndex && this.config.competType !== TraceCompetitionType.RAW;
    },
    contentType: {
      get: function() {
        if (this.config.kValue < 0) {
          return TraceContentType.COMPETITION_INDEX;
        } else if (this.config.kValue === 0) {
          return TraceContentType.ACTIVATIONS;
        } else {
          return TraceContentType.RESPONSE_PROBABILITIES;
        }
      },
      set: function(val) {
        if (val === TraceContentType.ACTIVATIONS) {
          this.$set(this.config, 'kValue', 0);
        } else if (val === TraceContentType.COMPETITION_INDEX) {
          this.$set(this.config, 'kValue', -1);
        } else {
          this.$set(this.config, 'kValue', 4);
        }
      }
    },
    useSpecifiedItems: {
      get: function () {
        return Array.isArray(this.config.itemsToWatch);
      },
      set: function (val) {
        if (val) {
          this.config.itemsToWatch = Array.from(this.itemsToWatch, item => item.phon);
        } else {
          this.config.itemsToWatch = this.numItemsToWatch;
        }
      },
    }
  },
  watch: {
    numItemsToWatch(val) {
      if (!this.useSpecifiedItems) {
        this.config.itemsToWatch = val;
      }
    },
  },
  methods: {
    isWatchingItem(item) {
      return this.itemsToWatch.has(item);
    },
    setIsWatchingItem(item, flag) {
      if (flag) {
        this.itemsToWatch.add(item);
        // todo: this is ugly
        this.config.itemsToWatch = Array.from(this.itemsToWatch, item => item.phon);
      } else {
        this.itemsToWatch.delete(item);
      }
    },
  }
}
</script>

<style lang="css">
.items-container {
  overflow-y: scroll;
  height: 150px;
}
</style>
