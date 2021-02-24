<template>
  <DataTab tab="phoneme" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import DataTab from './DataTab.vue';

export default defineComponent({
  name: 'PhonemeTab',
  components: {
    DataTab,
  },
});
</script>
