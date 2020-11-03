<template>
  <div>
    <div style="display: flex; margin-bottom: 1rem;">
      <a class="button" @click="addWord" style="margin-right: 0.5rem;">Add word</a>
      <file-upload @load="loadJtLexicon" style="margin-right: 0.5rem;" />
      <a class="button" @click="saveLexicon">Save lexicon</a>
    </div>
    <table class="table is-bordered">
      <thead>
        <tr>
          <th>Lexical Items</th>
          <th>Frequency</th>
          <th>Priming</th>
          <th class="is-paddingless"><a class="button" @click="deleteAll()">Delete All</a></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(lex, index) in lexicon" :key="index">
          <td class="is-paddingless"><input class="borderless-input" type="text" v-model="lex.phon" /></td>
          <td class="is-paddingless"><input class="borderless-input" type="text" v-model="lex.freq" /></td>
          <td class="is-paddingless"><input class="borderless-input" type="text" v-model="lex.prime" /></td>
          <td class="is-paddingless"><a class="button is-fullwidth" @click="deleteWord(index)">Delete</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import FileUpload from './FileUpload.vue'
import { parseJtLexicon, serializeJtLexicon } from 'tracejs'
import FileSaver from 'file-saver'

export default {
  props: {
    lexicon: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    loadJtLexicon(xmlText) {
      // replace the configuration in place
      this.lexicon.splice(0, this.lexicon.length, ...parseJtLexicon(xmlText))
    },
    saveLexicon() {
      const blob = new Blob([serializeJtLexicon(this.lexicon)], {type: 'application/xml'})
      FileSaver.saveAs(blob, 'lexicon.jt')
    },
    addWord() {
      this.lexicon.unshift({phon: '', freq: '', prime: ''})
    },
    deleteWord(index) {
      this.lexicon.splice(index, 1)
    },
    deleteAll() {
      this.lexicon.splice(0, this.lexicon.length)
    },
  },
  components: { FileUpload }
}
</script>
