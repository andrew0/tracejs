<template>
  <div>
    <table class="table is-bordered">
      <thead>
        <tr>
          <th>Lexical Items</th>
          <th>Frequency</th>
          <th>Priming</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(lex, index) in lexicon" :key="index">
          <td class="is-paddingless"><input class="borderless-input" type="text" v-model="lex.phon" /></td>
          <td class="is-paddingless"><input class="borderless-input" type="text" v-model="lex.freq" /></td>
          <td class="is-paddingless"><input class="borderless-input" type="text" v-model="lex.prime" /></td>
        </tr>
      </tbody>
    </table>
    <file-upload @load="loadJtLexicon" />
  </div>
</template>

<script>
import FileUpload from './FileUpload.vue'
import { parseJtLexicon } from 'tracejs'

export default {
  props: {
    lexicon: {
      type: Array,
      required: true
    }
  },
  methods: {
    loadJtLexicon(xmlText) {
      // replace the configuration in place
      this.lexicon.length = 0
      this.lexicon.push(...parseJtLexicon(xmlText))
    }
  },
  components: { FileUpload }
}
</script>
