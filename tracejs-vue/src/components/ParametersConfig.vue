<template>
  <div>
    <div class="field is-horizontal" style="width: 20rem;">
      <div class="field-label">
        <label class="label">Model Input</label>
      </div>
      <div class="field-body">
        <input class="input" type="text" v-model="config.modelInput" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: Object,
    default: () => ({})
  }
}
</script>
