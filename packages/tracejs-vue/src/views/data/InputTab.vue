<template>
  <DataTab :data="data" :show-cycles="false" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getStore } from '../../store';
import DataTab from './DataTab.vue';

export default defineComponent({
  name: 'InputTab',
  components: {
    DataTab,
  },
  setup() {
    return {
      data: getStore().formattedInputData,
    };
  },
});
</script>
