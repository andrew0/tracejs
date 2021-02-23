<template>
  <div>parameters config {{ store.state.numCycles }}</div>

  <button @click="store.setNumCycles(store.state.numCycles + 1)">inc</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { getStore } from '../store';

export default defineComponent({
  name: 'ConfigTab',
  setup() {
    return {
      store: getStore(),
    };
  },
});
</script>
