<template>
  <div class="notification is-danger" v-if="errors.length" style="margin: 1rem">
    <button class="delete" @click="clearErrors"></button>
    <span v-for="err in errors">{{ err }}</span>
  </div>
  <div :class="$style.columns">
    <div style="padding: 1rem; width: 600px; overflow-y: auto">
      <div style="display: flex; margin-bottom: 1rem">
        <file-upload @load="loadFromJson" style="margin-right: 0.5rem" label="Load from JSON" />
        <button class="button" @click="saveJson">Save JSON</button>
      </div>
      <ConfigInput
        v-model="config.modelInput"
        :last-value="lastConfig.modelInput"
        label="Model Input"
        note=""
        :error="isModelInputValid ? '' : 'Model input contains invalid characters'"
        type="text"
      />
      <ContinuumSpecInput />
      <ConfigInput
        v-model="config.alpha.IF"
        :last-value="lastConfig.alpha.IF"
        label="ALPHA[if]"
        note="Input-Feature weights"
      />
      <ConfigInput
        v-model="config.alpha.FP"
        :last-value="lastConfig.alpha.FP"
        label="ALPHA[fp]"
        note="Feature-Phoneme weights"
      />
      <ConfigInput
        v-model="config.alpha.PW"
        :last-value="lastConfig.alpha.PW"
        label="ALPHA[pw]"
        note="Phoneme-Word weights"
      />
      <ConfigInput
        v-model="config.alpha.PF"
        :last-value="lastConfig.alpha.PF"
        label="ALPHA[pf]"
        note="Phoneme-Feature weights"
      />
      <ConfigInput
        v-model="config.alpha.WP"
        :last-value="lastConfig.alpha.WP"
        label="ALPHA[wp]"
        note="Word-Phoneme weights"
      />
      <ConfigInput
        v-model="config.gamma.F"
        :last-value="lastConfig.gamma.F"
        label="GAMMA[f]"
        note="Feature layer inhibition"
      />
      <ConfigInput
        v-model="config.gamma.P"
        :last-value="lastConfig.gamma.P"
        label="GAMMA[p]"
        note="Phoneme layer inhibition"
      />
      <ConfigInput
        v-model="config.gamma.W"
        :last-value="lastConfig.gamma.W"
        label="GAMMA[w]"
        note="Word layer inhibition"
      />
      <ConfigInput
        v-model="config.decay.F"
        :last-value="lastConfig.decay.F"
        label="DECAY[f]"
        note="Feature decay"
      />
      <ConfigInput
        v-model="config.decay.P"
        :last-value="lastConfig.decay.P"
        label="DECAY[p]"
        note="Phoneme decay"
      />
      <ConfigInput
        v-model="config.decay.W"
        :last-value="lastConfig.decay.W"
        label="DECAY[w]"
        note="Word decay"
      />
      <ConfigInput
        v-model="config.rest.F"
        :last-value="lastConfig.rest.F"
        label="REST[f]"
        note="Feature resting activation"
      />
      <ConfigInput
        v-model="config.rest.P"
        :last-value="lastConfig.rest.P"
        label="REST[p]"
        note="Phoneme resting activation"
      />
      <ConfigInput
        v-model="config.rest.W"
        :last-value="lastConfig.rest.W"
        label="REST[w]"
        note="Word resting activation"
      />
      <ConfigInput
        v-model="config.noiseSD"
        :last-value="lastConfig.noiseSD"
        label="Input Noise (SD)"
        note=""
      />
      <ConfigInput
        v-model="config.stochasticitySD"
        :last-value="lastConfig.stochasticitySD"
        label="Stochasticity (SD)"
        note="McClelland: 0.02"
      />
      <ConfigInput
        v-model="config.atten"
        :last-value="lastConfig.atten"
        label="Attention"
        note="Lexical gain"
      />
      <ConfigInput
        v-model="config.bias"
        :last-value="lastConfig.bias"
        label="Bias"
        note="Lexical bias"
      />
      <ConfigInput
        v-model="config.spreadScale[0]"
        :last-value="lastConfig.spreadScale[0]"
        label="spreadScale"
        note="Scales FETSPREADs"
      />
      <ConfigInput
        v-model="config.min"
        :last-value="lastConfig.min"
        label="Min"
        note="Minimum activation"
      />
      <ConfigInput
        v-model="config.max"
        :last-value="lastConfig.max"
        label="Max"
        note="Maximum activation"
      />
      <ConfigInput
        v-model="config.freqNode.RDL_rest_s"
        :last-value="lastConfig.freqNode.RDL_rest_s"
        label="Frq resting levels"
      />
      <ConfigInput
        v-model="config.freqNode.RDL_wt_s"
        :last-value="lastConfig.freqNode.RDL_wt_s"
        label="Frq phoneme->word weights"
      />
      <ConfigInput
        v-model="config.freqNode.RDL_post_c"
        :last-value="lastConfig.freqNode.RDL_post_c"
        label="Frq post act"
      />
      <ConfigInput
        v-model="config.primeNode.RDL_rest_s"
        :last-value="lastConfig.primeNode.RDL_rest_s"
        label="Priming (rest)"
      />
      <ConfigInput
        v-model="config.primeNode.RDL_wt_s"
        :last-value="lastConfig.primeNode.RDL_wt_s"
        label="Priming (weight)"
      />
      <ConfigInput
        v-model="config.primeNode.RDL_post_c"
        :last-value="lastConfig.primeNode.RDL_post_c"
        label="Priming (post-act)"
      />
      <ConfigInput
        v-model="config.spread[0]"
        :last-value="lastConfig.spread[0]"
        label="FETSPREAD[pow]"
        note="Power feature spread"
        :step="1"
      />
      <ConfigInput
        v-model="config.spread[1]"
        :last-value="lastConfig.spread[1]"
        label="FETSPREAD[voc]"
        note="Vocalic feature spread"
        :step="1"
      />
      <ConfigInput
        v-model="config.spread[2]"
        :last-value="lastConfig.spread[2]"
        label="FETSPREAD[dif]"
        note="Diffuse feature spread"
        :step="1"
      />
      <ConfigInput
        v-model="config.spread[3]"
        :last-value="lastConfig.spread[3]"
        label="FETSPREAD[acu]"
        note="Accute feature spread"
        :step="1"
      />
      <ConfigInput
        v-model="config.spread[4]"
        :last-value="lastConfig.spread[4]"
        label="FETSPREAD[gra]"
        note="Gradient/Consonental feature spread"
        :step="1"
      />
      <ConfigInput
        v-model="config.spread[5]"
        :last-value="lastConfig.spread[5]"
        label="FETSPREAD[voi]"
        note="Voiced feature spread"
        :step="1"
      />
      <ConfigInput
        v-model="config.spread[6]"
        :last-value="lastConfig.spread[6]"
        label="FETSPREAD[bur]"
        note="Burst feature spread"
        :step="1"
      />
      <ConfigInput
        v-model="config.fSlices"
        :last-value="lastConfig.fSlices"
        label="fSlices"
        note="Number of time steps"
        :step="1"
      />
      <ConfigInput
        v-model="config.deltaInput"
        :last-value="lastConfig.deltaInput"
        label="deltaInput"
        note="Input phoneme interval"
        :step="1"
      />
      <ConfigInput
        v-model="config.nreps"
        :last-value="lastConfig.nreps"
        label="nreps"
        note="Input presentation rate"
        :step="1"
      />
      <ConfigInput
        v-model="config.slicesPerPhon"
        :last-value="lastConfig.slicesPerPhon"
        label="slicesPerPhon"
        note="Phoneme/Word slices per Feature"
        :step="1"
      />
      <ConfigInput
        v-model="config.lengthNormalization"
        :last-value="lastConfig.lengthNormalization"
        label="lengthNormalization"
        note="0 or 1; normalize length effects."
      />
    </div>

    <div style="flex: 1; display: flex; align-items: center; justify-content: center">
      <ModelInputChart style="width: 700px; height: 500px" />
    </div>
  </div>
</template>

<script lang="ts">
import FileSaver from 'file-saver';
import { computed, defineComponent } from 'vue';
import ModelInputChart from '../../components/charts/ModelInputChart.vue';
import ConfigInput from '../../components/ConfigInput.vue';
import ContinuumSpecInput from '../../components/ContinuumSpecInput.vue';
import FileUpload from '../../components/FileUpload.vue';
import { getStore } from '../../store';

export default defineComponent({
  name: 'ParametersTab',
  components: {
    ConfigInput,
    ContinuumSpecInput,
    FileUpload,
    ModelInputChart,
  },
  setup() {
    const store = getStore();
    const errors: string[] = [];
    return {
      isModelInputValid: store.isModelInputValid,
      config: computed(() => store.config),
      lastConfig: computed(() => store.lastSimConfig.value),
      loadFromJson: (text: string) => {
        try {
          Object.assign(store.config, JSON.parse(text));
        } catch (err: any) {
          errors.push(err.message);
        }
      },
      saveJson: () => {
        const blob = new Blob([JSON.stringify(store.config, null, 2) + '\n'], {
          type: 'application/json',
        });
        FileSaver.saveAs(blob, 'config.json');
      },
      errors,
      clearErrors: () => errors.splice(0, errors.length),
    };
  },
});
</script>

<style module>
.columns {
  display: flex;
  height: 100%;
}
</style>
