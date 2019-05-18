<template>
  <div class="file">
    <label class="file-label">
      <input class="file-input" type="file" name="resume" @change="loadTextFromFile">
      <span class="file-cta">
        <span class="file-label">
          {{ label }}
        </span>
      </span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Choose a file'
    }
  },
  methods: {
    loadTextFromFile(event) {
      const reader = new FileReader()
      reader.onload = e => this.$emit('load', e.target.result)
      reader.readAsText(event.target.files[0])
    }
  }
};
</script>
