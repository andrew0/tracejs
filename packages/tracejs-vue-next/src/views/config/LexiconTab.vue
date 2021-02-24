<template>
  <div style="margin: 1rem">
    <div style="display: flex; margin-bottom: 1rem">
      <a class="button" @click="addWord" style="margin-right: 0.5rem">Add word</a>
      <!-- <file-upload @load="loadJtLexicon" style="margin-right: 0.5rem;" />
      <a class="button" @click="saveLexicon">Save lexicon</a> -->
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
          <td class="is-paddingless"><input class="input" type="text" v-model="lex.phon" /></td>
          <td class="is-paddingless"><input class="input" type="text" v-model="lex.freq" /></td>
          <td class="is-paddingless"><input class="input" type="text" v-model="lex.prime" /></td>
          <td class="is-paddingless">
            <a class="button is-fullwidth" @click="deleteWord(index)">Delete</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { getStore } from '../../store';

export default defineComponent({
  name: 'LexiconTab',
  setup() {
    const store = getStore();
    const lexicon = computed(() => store.config.lexicon);
    const addWord = () => lexicon.value.unshift({ phon: '', freq: 0, prime: 0 });
    const deleteWord = (idx: number) => lexicon.value.splice(idx, 1);
    const deleteAll = () => lexicon.value.splice(0, lexicon.value.length);
    return { lexicon, addWord, deleteWord, deleteAll };
  },
});
</script>
