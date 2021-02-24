<template>
  <div :class="$style.container">
    <div :class="$style.toolbar">
      <SimulationToolbar :show-cycles="showCycles" />
    </div>

    <!-- make sure this doesn't get formatted to multiple lines, since -->
    <!-- whitespace will get displayed in the <pre> tag -->
    <!-- prettier-ignore -->
    <pre :class="$style.main">{{ data || 'No data' }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import SimulationToolbar from '../components/SimulationToolbar.vue';

export default defineComponent({
  name: 'DataTab',
  components: {
    SimulationToolbar,
  },
  props: {
    showCycles: {
      type: Boolean,
      default: true,
    },
    data: {
      type: String,
      default: '',
    },
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
