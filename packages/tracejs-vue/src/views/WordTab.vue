<template>
  <DataTab :data="data" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getStore } from '../store';

import DataTab from './DataTab.vue';

export default defineComponent({
  name: 'WordTab',
  components: {
    DataTab,
  },
  setup() {
    return {
      data: getStore().formattedWordData,
    };
  },
});
</script>
