<template>
  <div class="field is-horizontal" style="width: 30rem">
    <div class="field-label">
      <label class="label" style="width: 10rem">{{ label }}</label>
    </div>
    <div class="field-body">
      <div class="field">
        <input class="input" :type="type" :value="modelValue" @input="onInput" />
        <p class="help is-info">{{ note }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'ConfigInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
    type: {
      type: String as PropType<'text' | 'number'>,
      default: 'number',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return {
      onInput: (evt: any) => {
        const value = props.type === 'number' ? Number(evt.target.value) : evt.target.value;
        emit('update:modelValue', value);
      },
    };
  },
});
</script>
