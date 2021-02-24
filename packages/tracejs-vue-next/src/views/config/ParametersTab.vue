<template>
  <div :class="$style.columns">
    <div style="padding: 1rem; width: 600px; overflow-y: auto">
      <config-input v-model="config.modelInput" label="Model Input" note="" type="text" />
      <config-input
        v-model="config.continuumSpec"
        label="continuumSpec"
        note="Ambiguous phoneme continuum"
        type="text"
      />
      <config-input v-model="config.alpha.IF" label="ALPHA[if]" note="Input-Feature weights" />
      <config-input v-model="config.alpha.FP" label="ALPHA[fp]" note="Feature-Phoneme weights" />
      <config-input v-model="config.alpha.PW" label="ALPHA[pw]" note="Phoneme-Word weights" />
      <config-input v-model="config.alpha.PF" label="ALPHA[pf]" note="Phoneme-Feature weights" />
      <config-input v-model="config.alpha.WP" label="ALPHA[wp]" note="Word-Phoneme weights" />
      <config-input v-model="config.gamma.F" label="GAMMA[f]" note="Feature layer inhibition" />
      <config-input v-model="config.gamma.P" label="GAMMA[p]" note="Phoneme layer inhibition" />
      <config-input v-model="config.gamma.W" label="GAMMA[w]" note="Word layer inhibition" />
      <config-input v-model="config.decay.F" label="DECAY[f]" note="Feature decay" />
      <config-input v-model="config.decay.P" label="DECAY[p]" note="Phoneme decay" />
      <config-input v-model="config.decay.W" label="DECAY[w]" note="Word decay" />
      <config-input v-model="config.rest.F" label="REST[f]" note="Feature resting activation" />
      <config-input v-model="config.rest.P" label="REST[p]" note="Phoneme resting activation" />
      <config-input v-model="config.rest.W" label="REST[w]" note="Word resting activation" />
      <config-input v-model="config.noiseSD" label="Input Noise (SD)" note="" />
      <config-input
        v-model="config.stochasticitySD"
        label="Stochasticity (SD)"
        note="McClelland: 0.02"
      />
      <config-input v-model="config.atten" label="Attention" note="Lexical gain" />
      <config-input v-model="config.bias" label="Bias" note="Lexical bias" />
      <config-input v-model="config.spreadScale[0]" label="spreadScale" note="Scales FETSPREADs" />
      <config-input v-model="config.min" label="Min" note="Minimum activation" />
      <config-input v-model="config.max" label="Max" note="Maximum activation" />
      <config-input v-model="config.spread[0]" label="FETSPREAD[pow]" note="Power feature spread" />
      <config-input
        v-model="config.spread[1]"
        label="FETSPREAD[voc]"
        note="Vocalic feature spread"
      />
      <config-input
        v-model="config.spread[2]"
        label="FETSPREAD[dif]"
        note="Diffuse feature spread"
      />
      <config-input
        v-model="config.spread[3]"
        label="FETSPREAD[acu]"
        note="Accute feature spread"
      />
      <config-input
        v-model="config.spread[4]"
        label="FETSPREAD[gra]"
        note="Gradient/Consonental feature spread"
      />
      <config-input
        v-model="config.spread[5]"
        label="FETSPREAD[voi]"
        note="Voiced feature spread"
      />
      <config-input v-model="config.spread[6]" label="FETSPREAD[bur]" note="Burst feature spread" />
      <config-input v-model="config.fSlices" label="fSlices" note="Number of time steps" />
      <config-input v-model="config.deltaInput" label="deltaInput" note="Input phoneme interval" />
      <config-input v-model="config.nreps" label="nreps" note="Input presentation rate" />
      <config-input
        v-model="config.slicesPerPhon"
        label="slicesPerPhon"
        note="Phoneme/Word slices per Feature"
      />
      <config-input
        v-model="config.lengthNormalization"
        label="lengthNormalization"
        note="0 or 1; normalize length effects."
      />
    </div>

    <div style="flex: 1; display: flex; align-items: center; justify-content: center">
      <ModelInputChart style="width: 700px; height: 500px" reactive />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import ConfigInput from '../../components/ConfigInput.vue';
import ModelInputChart from '../../components/charts/ModelInputChart.vue';
import { getStore } from '../../store';

export default defineComponent({
  name: 'ParametersTab',
  components: {
    ConfigInput,
    ModelInputChart,
  },
  setup() {
    const store = getStore();
    return {
      config: computed(() => store.config),
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
