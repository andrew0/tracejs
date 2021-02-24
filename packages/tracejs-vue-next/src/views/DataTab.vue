<template>
  <div :class="$style.container">
    <div :class="$style.toolbar">
      <SimulationToolbar show-cycles />
    </div>

    <!-- make sure this doesn't get formatted to multiple lines, since -->
    <!-- whitespace will get displayed in the <pre> tag -->
    <!-- prettier-ignore -->
    <pre :class="$style.main">{{ data || 'No data' }}</pre>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import SimulationToolbar from '../components/SimulationToolbar.vue';
import { getStore } from '../store';

export default defineComponent({
  name: 'DataTab',
  components: {
    SimulationToolbar,
  },
  props: {
    tab: {
      type: String as PropType<'input' | 'feature' | 'phoneme' | 'word' | 'analysis'>,
      required: true,
    },
  },
  setup(props) {
    const store = getStore();
    return {
      data: computed(() => {
        switch (props.tab) {
          case 'input':
            return store.formattedInputData.value;
          case 'feature':
            return store.formattedFeatureData.value;
          case 'phoneme':
            return store.formattedPhonemeData.value;
          case 'word':
            return store.formattedWordData.value;
          default:
            return '';
        }
      }),
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

.toolbar {
  flex: 0;
  background: white;
  border-bottom: 1px solid #dbdbdb;
}

.main {
  flex: 1;
  width: 100%;
  overflow: auto;
}
</style>
