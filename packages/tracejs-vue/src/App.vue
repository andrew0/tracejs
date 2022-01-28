<template>
  <nav :class="$style.nav">
    <NavigationTabs :labels="labels" v-model:active-index="activeIndex" is-boxed />
  </nav>

  <main :class="$style.main">
    <Suspense>
      <template #default>
        <component :is="activeComponent"></component>
      </template>

      <template #fallback>loading...</template>
    </Suspense>
  </main>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';

import NavigationTabs from './components/NavigationTabs.vue';
import { createStore } from './store';

export default defineComponent({
  name: 'App',
  components: {
    NavigationTabs,
  },
  setup() {
    const tabs = [
      {
        label: 'Config',
        component: defineAsyncComponent(() => import('./views/ConfigTab.vue')),
      },
      {
        label: 'Simulation',
        component: defineAsyncComponent(() => import('./views/SimulationTab.vue')),
      },
      {
        label: 'Chart',
        component: defineAsyncComponent(() => import('./views/ChartTab.vue')),
      },
      {
        label: 'Chart Data',
        component: defineAsyncComponent(() => import('./views/ChartDataTab.vue')),
      },
      {
        label: 'Input',
        component: defineAsyncComponent(() => import('./views/InputTab.vue')),
      },
      {
        label: 'Feature',
        component: defineAsyncComponent(() => import('./views/FeatureTab.vue')),
      },
      {
        label: 'Phoneme',
        component: defineAsyncComponent(() => import('./views/PhonemeTab.vue')),
      },
      {
        label: 'Word',
        component: defineAsyncComponent(() => import('./views/WordTab.vue')),
      },
      {
        label: 'Levels and Flow',
        component: defineAsyncComponent(() => import('./views/LevelsAndFlowTab.vue')),
      },
    ];
    const activeIndex = ref(0);

    return {
      labels: tabs.map((tab) => tab.label),
      activeIndex,
      activeComponent: computed(() => tabs[activeIndex.value].component),
      store: createStore(),
    };
  },
});
</script>

<style>
body,
html {
  margin: 0;
  height: 100%;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<style module>
.nav {
  flex: 0;
}

.main {
  flex: 1;
  overflow-y: auto;
  background: #fafafa;
}
</style>
