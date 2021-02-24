<template>
  <DataTab tab="input" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import DataTab from './DataTab.vue';

export default defineComponent({
  name: 'InputTab',
  components: {
    DataTab,
  },
});
</script>
