<template>
  <div class="field is-horizontal" style="width: 30rem;">
    <div class="field-label">
      <label class="label" style="width: 10rem;">{{ label }}</label>
    </div>
    <div class="field-body">
      <div class="field">
        <input class="input" type="text" :value="value" @input="$emit('input', $event.target.value)" />
        <p class="help is-info">{{ note }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'label', 'note']
}
</script>
