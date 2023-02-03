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
import { computed, ComputedRef, defineAsyncComponent, defineComponent, ref } from 'vue';
import NavigationTabs from './components/NavigationTabs.vue';
import { createStore } from './store';

interface Tab {
  label: string | ComputedRef<string>;
  component: ReturnType<typeof defineAsyncComponent>;
}

export default defineComponent({
  name: 'App',
  components: {
    NavigationTabs,
  },
  setup() {
    const store = createStore();
    const tabs: Tab[] = [
      {
        label: computed(() => `Config${store.isConfigChanged.value ? ' [*]' : ''}`),
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
        label: 'Data',
        component: defineAsyncComponent(() => import('./views/AllDataTab.vue')),
      },
    ];
    const activeIndex = ref(0);

    return {
      labels: computed(() =>
        tabs.map((tab) => (typeof tab.label === 'string' ? tab.label : tab.label.value))
      ),
      activeIndex,
      activeComponent: computed(() => tabs[activeIndex.value].component),
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
