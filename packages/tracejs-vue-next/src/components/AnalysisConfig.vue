<template>
  <div>
    <p>
      NOTE: if the chart doesn't appear, try resizing your browser window to make it redraw (this is
      a known bug)
    </p>

    <div class="field">
      <button class="button" @click="store.updateAnalysis()">Refresh chart</button>
    </div>

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
          Use top
          <input
            type="number"
            style="width: 50px"
            :disabled="useSpecifiedItems"
            v-model="numItemsToWatch"
          />
          items
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
            <input
              type="checkbox"
              :checked="isWatchingItem(word)"
              @change="setIsWatchingItem(word, $event.target.checked)"
            />
            {{ word.phon }}
          </label>
        </div>
      </div>
      <div class="control" v-else>
        <label class="checkbox">
          <input type="checkbox" name="items" v-model="config.excludeSilence" />
          Exclude silence
        </label>
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
        <input class="input" min="0" type="number" v-model="config.kValue" style="width: 50px" />
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

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue';
import {
  TraceDomain,
  TraceContentType,
  TraceCalculationType,
  TraceCompetitionType,
  TraceChoice,
  TraceWord,
} from 'tracejs';
import { getStore } from '../store';

export default defineComponent({
  setup() {
    const store = getStore();
    const simConfig = store.config;
    const config = store.analysisConfig;

    const itemsToWatch = new Set<TraceWord>();
    const numItemsToWatch = ref(typeof config.itemsToWatch === 'number' ? config.itemsToWatch : 10);
    const useSpecifiedItems = computed<boolean>({
      get() {
        return Array.isArray(config.itemsToWatch);
      },
      set(val) {
        if (val) {
          config.itemsToWatch = Array.from(itemsToWatch, (item) => item.phon);
        } else {
          config.itemsToWatch = numItemsToWatch.value;
        }
      },
    });
    watchEffect(() => {
      if (!useSpecifiedItems.value) {
        config.itemsToWatch = numItemsToWatch.value;
      }
    });

    const contentType = ref(TraceContentType.ACTIVATIONS);
    watchEffect(() => {
      if (contentType.value === TraceContentType.ACTIVATIONS) {
        config.kValue = 0;
      } else if (contentType.value === TraceContentType.COMPETITION_INDEX) {
        config.kValue = -1;
      } else {
        config.kValue = 4;
      }
    });

    return {
      store,
      simConfig,
      config,
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
        'Max (Post-Hoc)': TraceCalculationType.MAX_POSTHOC,
        Specified: TraceCalculationType.STATIC,
      },

      contentType,
      itemsToWatch,
      numItemsToWatch,

      useSpecifiedItems,

      shouldShowAlignmentCalc: computed(
        () => contentType.value !== TraceContentType.COMPETITION_INDEX
      ),
      shouldShowAlignment: computed(() => {
        const { calculationType } = config;
        return (
          contentType.value !== TraceContentType.COMPETITION_INDEX &&
          calculationType === TraceCalculationType.STATIC
        );
      }),
      shouldShowLuceChoice: computed(
        () => contentType.value === TraceContentType.RESPONSE_PROBABILITIES
      ),
      shouldShowItems: computed(() => contentType.value !== TraceContentType.COMPETITION_INDEX),
      shouldShowCompetIndex: computed(
        () => contentType.value === TraceContentType.COMPETITION_INDEX
      ),
      shouldShowCompetSlope: computed(
        () =>
          contentType.value === TraceContentType.COMPETITION_INDEX &&
          config.competType !== TraceCompetitionType.RAW
      ),

      isWatchingItem(item: TraceWord) {
        return itemsToWatch.has(item);
      },

      setIsWatchingItem(item: TraceWord, flag: boolean) {
        if (flag) {
          itemsToWatch.add(item);
          config.itemsToWatch = Array.from(itemsToWatch, (item) => item.phon);
        } else {
          itemsToWatch.delete(item);
        }
      },
    };
  },
});
</script>

<style>
.items-container {
  overflow-y: scroll;
  height: 150px;
}
</style>
