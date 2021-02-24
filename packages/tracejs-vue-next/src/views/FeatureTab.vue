<template>
  <DataTab tab="feature" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import DataTab from './DataTab.vue';

export default defineComponent({
  name: 'FeatureTab',
  components: {
    DataTab,
  },
});
</script>
