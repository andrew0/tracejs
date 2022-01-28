<template>
  <div class="file">
    <label class="file-label">
      <input class="file-input" type="file" name="resume" @change="loadTextFromFile" />
      <span class="file-cta">
        <span class="file-label">
          {{ label }}
        </span>
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FileUpload',
  props: {
    label: {
      type: String,
      default: 'Choose a file',
    },
  },
  emits: ['load'],
  setup(_props, { emit }) {
    return {
      loadTextFromFile(event: any) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            emit('load', e.target.result);
          }
        };
        reader.readAsText(event.target.files[0]);
      },
    };
  },
});
</script>
