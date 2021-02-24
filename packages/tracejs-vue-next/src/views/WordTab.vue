<template>
  <DataTab tab="word" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import DataTab from './DataTab.vue';

export default defineComponent({
  name: 'WordTab',
  components: {
    DataTab,
  },
});
</script>
