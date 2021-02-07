<template>
  <div>
    <parameter-config-input v-model="config.modelInput" label="Model Input" note="" />
    <continuum-spec :config="config" />
    <parameter-config-input v-model="config.continuumSpec" label="continuumSpec" note="Ambiguous phoneme continuum" />
    <parameter-config-input v-model="config.alpha.IF" label="ALPHA[if]" note="Input-Feature weights" />
    <parameter-config-input v-model="config.alpha.FP" label="ALPHA[fp]" note="Feature-Phoneme weights" />
    <parameter-config-input v-model="config.alpha.PW" label="ALPHA[pw]" note="Phoneme-Word weights" />
    <parameter-config-input v-model="config.alpha.PF" label="ALPHA[pf]" note="Phoneme-Feature weights" />
    <parameter-config-input v-model="config.alpha.WP" label="ALPHA[wp]" note="Word-Phoneme weights" />
    <parameter-config-input v-model="config.gamma.F" label="GAMMA[f]" note="Feature layer inhibition" />
    <parameter-config-input v-model="config.gamma.P" label="GAMMA[p]" note="Phoneme layer inhibition" />
    <parameter-config-input v-model="config.gamma.W" label="GAMMA[w]" note="Word layer inhibition" />
    <parameter-config-input v-model="config.decay.F" label="DECAY[f]" note="Feature decay" />
    <parameter-config-input v-model="config.decay.P" label="DECAY[p]" note="Phoneme decay" />
    <parameter-config-input v-model="config.decay.W" label="DECAY[w]" note="Word decay" />
    <parameter-config-input v-model="config.rest.F" label="REST[f]" note="Feature resting activation" />
    <parameter-config-input v-model="config.rest.P" label="REST[p]" note="Phoneme resting activation" />
    <parameter-config-input v-model="config.rest.W" label="REST[w]" note="Word resting activation" />
    <parameter-config-input v-model="config.noiseSD" label="Input Noise (SD)" note="" />
    <parameter-config-input v-model="config.stochasticitySD" label="Stochasticity (SD)" note="McClelland: 0.02" />
    <parameter-config-input v-model="config.atten" label="Attention" note="Lexical gain" />
    <parameter-config-input v-model="config.bias" label="Bias" note="Lexical bias" />
    <parameter-config-input v-model="config.spreadScale[0]" label="spreadScale" note="Scales FETSPREADs" />
    <parameter-config-input v-model="config.min" label="Min" note="Minimum activation" />
    <parameter-config-input v-model="config.max" label="Max" note="Maximum activation" />
    <parameter-config-input v-model="config.spread[0]" label="FETSPREAD[pow]" note="Power feature spread" />
    <parameter-config-input v-model="config.spread[1]" label="FETSPREAD[voc]" note="Vocalic feature spread" />
    <parameter-config-input v-model="config.spread[2]" label="FETSPREAD[dif]" note="Diffuse feature spread" />
    <parameter-config-input v-model="config.spread[3]" label="FETSPREAD[acu]" note="Accute feature spread" />
    <parameter-config-input v-model="config.spread[4]" label="FETSPREAD[gra]" note="Gradient/Consonental feature spread" />
    <parameter-config-input v-model="config.spread[5]" label="FETSPREAD[voi]" note="Voiced feature spread" />
    <parameter-config-input v-model="config.spread[6]" label="FETSPREAD[bur]" note="Burst feature spread" />
    <parameter-config-input v-model="config.fSlices" label="fSlices" note="Number of time steps" />
    <parameter-config-input v-model="config.deltaInput" label="deltaInput" note="Input phoneme interval" />
    <parameter-config-input v-model="config.nreps" label="nreps" note="Input presentation rate" />
    <parameter-config-input v-model="config.slicesPerPhon" label="slicesPerPhon" note="Phoneme/Word slices per Feature" />
    <parameter-config-input v-model="config.lengthNormalization" label="lengthNormalization" note="0 or 1; normalize length effects." />
  </div>
</template>

<script>
import ParameterConfigInput from './ParameterConfigInput.vue'
import ContinuumSpec from './ContinuumSpec.vue'

export default {
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
  },
  components: { ParameterConfigInput, ContinuumSpec }
}
</script>
