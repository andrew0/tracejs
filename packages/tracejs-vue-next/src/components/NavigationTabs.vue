<template>
  <div class="tabs is-boxed">
    <ul style="padding: 0.25em 0 0 0.5em">
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
  },
  emits: ['update:activeIndex'],
  setup(_, { emit }) {
    return {
      setActiveIndex: (idx: number) => emit('update:activeIndex', idx),
    };
  },
});
</script>
