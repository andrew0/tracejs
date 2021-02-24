<template>
  <div :class="$style.container">
    <div :class="$style.nav">
      <NavigationTabs :labels="labels" v-model:active-index="activeIndex" />
    </div>

    <div :class="$style.main">
      <component :is="activeComponent"></component>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

import NavigationTabs from '../components/NavigationTabs.vue';
import ParametersTab from './config/ParametersTab.vue';
import PhonologyTab from './config/PhonologyTab.vue';
import LexiconTab from './config/LexiconTab.vue';

import { getStore } from '../store';

export default defineComponent({
  name: 'ConfigTab',
  components: {
    NavigationTabs,
  },
  setup() {
    const tabs = [
      {
        label: 'Parameters',
        component: ParametersTab,
      },
      {
        label: 'Phonology',
        component: PhonologyTab,
      },
      {
        label: 'Lexicon',
        component: LexiconTab,
      },
    ];
    const activeIndex = ref(0);

    return {
      labels: tabs.map((tab) => tab.label),
      activeIndex,
      activeComponent: computed(() => tabs[activeIndex.value].component),
      store: getStore(),
    };
  },
});
</script>

<style module>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.nav {
  flex: 0;
  background: white;
}

.main {
  flex: 1;
  overflow-y: auto;
}
</style>
