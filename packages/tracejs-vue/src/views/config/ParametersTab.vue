<template>
  <div :class="$style.columns">
    <div style="padding: 1rem; width: 600px; overflow-y: auto">
      <ConfigInput v-model="config.modelInput" label="Model Input" note="" type="text" />
      <ContinuumSpecInput />
      <ConfigInput v-model="config.alpha.IF" label="ALPHA[if]" note="Input-Feature weights" />
      <ConfigInput v-model="config.alpha.FP" label="ALPHA[fp]" note="Feature-Phoneme weights" />
      <ConfigInput v-model="config.alpha.PW" label="ALPHA[pw]" note="Phoneme-Word weights" />
      <ConfigInput v-model="config.alpha.PF" label="ALPHA[pf]" note="Phoneme-Feature weights" />
      <ConfigInput v-model="config.alpha.WP" label="ALPHA[wp]" note="Word-Phoneme weights" />
      <ConfigInput v-model="config.gamma.F" label="GAMMA[f]" note="Feature layer inhibition" />
      <ConfigInput v-model="config.gamma.P" label="GAMMA[p]" note="Phoneme layer inhibition" />
      <ConfigInput v-model="config.gamma.W" label="GAMMA[w]" note="Word layer inhibition" />
      <ConfigInput v-model="config.decay.F" label="DECAY[f]" note="Feature decay" />
      <ConfigInput v-model="config.decay.P" label="DECAY[p]" note="Phoneme decay" />
      <ConfigInput v-model="config.decay.W" label="DECAY[w]" note="Word decay" />
      <ConfigInput v-model="config.rest.F" label="REST[f]" note="Feature resting activation" />
      <ConfigInput v-model="config.rest.P" label="REST[p]" note="Phoneme resting activation" />
      <ConfigInput v-model="config.rest.W" label="REST[w]" note="Word resting activation" />
      <ConfigInput v-model="config.noiseSD" label="Input Noise (SD)" note="" />
      <ConfigInput
        v-model="config.stochasticitySD"
        label="Stochasticity (SD)"
        note="McClelland: 0.02"
      />
      <ConfigInput v-model="config.atten" label="Attention" note="Lexical gain" />
      <ConfigInput v-model="config.bias" label="Bias" note="Lexical bias" />
      <ConfigInput v-model="config.spreadScale[0]" label="spreadScale" note="Scales FETSPREADs" />
      <ConfigInput v-model="config.min" label="Min" note="Minimum activation" />
      <ConfigInput v-model="config.max" label="Max" note="Maximum activation" />
      <ConfigInput v-model="config.freqNode.RDL_rest_s" label="Frq resting levels" />
      <ConfigInput v-model="config.freqNode.RDL_wt_s" label="Frq phoneme->word weights" />
      <ConfigInput v-model="config.freqNode.RDL_post_c" label="Frq post act" />
      <ConfigInput v-model="config.primeNode.RDL_rest_s" label="Priming (rest)" />
      <ConfigInput v-model="config.primeNode.RDL_wt_s" label="Priming (weight)" />
      <ConfigInput v-model="config.primeNode.RDL_post_c" label="Priming (post-act)" />
      <ConfigInput v-model="config.spread[0]" label="FETSPREAD[pow]" note="Power feature spread" />
      <ConfigInput
        v-model="config.spread[1]"
        label="FETSPREAD[voc]"
        note="Vocalic feature spread"
      />
      <ConfigInput
        v-model="config.spread[2]"
        label="FETSPREAD[dif]"
        note="Diffuse feature spread"
      />
      <ConfigInput v-model="config.spread[3]" label="FETSPREAD[acu]" note="Accute feature spread" />
      <ConfigInput
        v-model="config.spread[4]"
        label="FETSPREAD[gra]"
        note="Gradient/Consonental feature spread"
      />
      <ConfigInput v-model="config.spread[5]" label="FETSPREAD[voi]" note="Voiced feature spread" />
      <ConfigInput v-model="config.spread[6]" label="FETSPREAD[bur]" note="Burst feature spread" />
      <ConfigInput v-model="config.fSlices" label="fSlices" note="Number of time steps" />
      <ConfigInput v-model="config.deltaInput" label="deltaInput" note="Input phoneme interval" />
      <ConfigInput v-model="config.nreps" label="nreps" note="Input presentation rate" />
      <ConfigInput
        v-model="config.slicesPerPhon"
        label="slicesPerPhon"
        note="Phoneme/Word slices per Feature"
      />
      <ConfigInput
        v-model="config.lengthNormalization"
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
import { defineComponent, computed } from 'vue';

import ConfigInput from '../../components/ConfigInput.vue';
import ContinuumSpecInput from '../../components/ContinuumSpecInput.vue';
import ModelInputChart from '../../components/charts/ModelInputChart.vue';
import { getStore } from '../../store';

export default defineComponent({
  name: 'ParametersTab',
  components: {
    ConfigInput,
    ContinuumSpecInput,
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
