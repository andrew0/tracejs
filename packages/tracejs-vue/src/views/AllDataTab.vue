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
import { computed, defineComponent, ref } from 'vue';
import NavigationTabs from '../components/NavigationTabs.vue';
import ChartDataTab from './data/ChartDataTab.vue';
import FeatureTab from './data/FeatureTab.vue';
import PhonemeTab from './data/PhonemeTab.vue';
import InputTab from './data/InputTab.vue';
import LevelsAndFlowTab from './data/LevelsAndFlowTab.vue';
import WordTab from './data/WordTab.vue';

export default defineComponent({
  name: 'AllDataTab',
  components: {
    NavigationTabs,
  },
  setup() {
    const tabs = [
      {
        label: 'Chart',
        component: ChartDataTab,
      },
      {
        label: 'Input',
        component: InputTab,
      },
      {
        label: 'Feature',
        component: FeatureTab,
      },
      {
        label: 'Phoneme',
        component: PhonemeTab,
      },
      {
        label: 'Word',
        component: WordTab,
      },
      {
        label: 'Levels and Flow',
        component: LevelsAndFlowTab,
      },
    ];
    const activeIndex = ref(0);

    return {
      labels: tabs.map((tab) => tab.label),
      activeIndex,
      activeComponent: computed(() => tabs[activeIndex.value].component),
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
