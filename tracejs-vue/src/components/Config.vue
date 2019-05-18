<template>
  <div style="width: 100%;">
    <div class="tabs">
      <ul>
        <li v-for="(tab, index) in tabs" :key="index" :class="{ 'tabs-margin': true, 'is-active': activeTab == index }">
          <a @click="activeTab = index">{{ tab }}</a>
        </li>
      </ul>
    </div>
    <div style="margin: 1rem;">
      <phoneme-config v-if="activeTab == 0" :phonemes="config.phonology" />
      <lexicon-config v-if="activeTab == 1" :lexicon="config.lexicon" />
    </div>
  </div>
</template>

<script>
import PhonemeConfig from './PhonemeConfig.vue'
import LexiconConfig from './LexiconConfig.vue'

export default {
  props: {
    config: Object,
    required: true
  },
  data() {
    return {
      tabs: ['Phonology', 'Lexicon'],
      activeTab: 0
    }
  },
  components: { PhonemeConfig, LexiconConfig }
}
</script>

<style>
.tabs-margin:first-child {
  margin-left: 1rem;
}
.borderless-input {
  background-color: transparent;
  border: 0 solid;
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: 400;
}
</style>