<template>
  <SimulationToolbar />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import SimulationToolbar from '../components/SimulationToolbar.vue';

export default defineComponent({
  name: 'SimulationTab',
  components: {
    SimulationToolbar,
  },
});
</script>
