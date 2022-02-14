<template>
  <div style="margin: 1rem">
    <div class="notification is-danger" v-if="errors.length">
      <button class="delete" @click="clearErrors"></button>
      <span v-for="err in errors">{{ err }}</span>
    </div>
    <div style="display: flex; margin-bottom: 1rem">
      <button class="button" @click="addWord" style="margin-right: 0.5rem">Add word</button>
      <file-upload @load="loadJtLexicon" style="margin-right: 0.5rem" label="Load from XML" />
      <button class="button" @click="saveLexicon" style="margin-right: 0.5rem">Save XML</button>
      <file-upload @load="loadJsonLexicon" style="margin-right: 0.5rem" label="Load from JSON" />
      <button class="button" @click="saveLexiconJson">Save JSON</button>
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
import FileSaver from 'file-saver';
import { parseJsonLexicon, parseJtLexicon, serializeJtLexicon } from 'tracejs';
import { computed, defineComponent, ref } from 'vue';
import FileUpload from '../../components/FileUpload.vue';
import { getStore } from '../../store';

export default defineComponent({
  name: 'LexiconTab',
  components: { FileUpload },
  setup() {
    const store = getStore();

    const errors = ref<string[]>([]);

    const clearErrors = () => errors.value.splice(0, errors.value.length);

    const lexicon = computed(() => store.config.lexicon);

    const addWord = () => lexicon.value.unshift({ phon: '', freq: 0, prime: 0 });

    const deleteWord = (idx: number) => lexicon.value.splice(idx, 1);

    const deleteAll = () => lexicon.value.splice(0, lexicon.value.length);

    const loadJtLexicon = (xmlText: string) =>
      lexicon.value.splice(0, lexicon.value.length, ...parseJtLexicon(xmlText));

    const loadJsonLexicon = (text: string) => {
      try {
        lexicon.value.splice(0, lexicon.value.length, ...parseJsonLexicon(JSON.parse(text)));
      } catch (err: any) {
        if (err.errors) {
          errors.value.splice(0, errors.value.length, ...err.errors);
        } else {
          errors.value.splice(0, errors.value.length, err.message);
        }
      }
    };

    const saveLexicon = () =>
      FileSaver.saveAs(
        new Blob([serializeJtLexicon(store.config.lexicon)], { type: 'application/xml' }),
        'lexicon.jt'
      );

    const saveLexiconJson = () =>
      FileSaver.saveAs(
        new Blob([JSON.stringify(store.config.lexicon, null, 2) + '\n'], {
          type: 'application/json',
        }),
        'lexicon.json'
      );

    return {
      errors,
      clearErrors,
      lexicon,
      addWord,
      deleteWord,
      deleteAll,
      loadJtLexicon,
      loadJsonLexicon,
      saveLexicon,
      saveLexiconJson,
    };
  },
});
</script>
