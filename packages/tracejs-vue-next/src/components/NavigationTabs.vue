<template>
  <div :class="{ tabs: true, 'is-boxed': isBoxed }">
    <ul style="padding: 0.25rem 0 0 0.5rem">
      <li
        v-for="(label, index) in labels"
        :key="index"
        :class="{ 'is-active': activeIndex === index }"
      >
        <a @click="setActiveIndex(index)">{{ label }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'NavigationTabs',
  props: {
    labels: {
      type: Array as PropType<string[]>,
      required: true,
    },
    activeIndex: {
      type: Number,
      default: 0,
    },
    isBoxed: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:activeIndex'],
  setup(_, { emit }) {
    return {
      setActiveIndex: (idx: number) => emit('update:activeIndex', idx),
    };
  },
});
</script>
