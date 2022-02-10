import { RdlNode } from './trace-param';

/* Acts as interface for calling up different hypothetical frequency effects
 * that may be applied at different points during a TRACE simulation.
 * Also may act as an interface between the TRACE model and lexicon if the
 * lexical model requires such interactions.  For example, if an instance of
 * lexical access by the model led to a modification of a lexical representation.
 * See: https://web.archive.org/web/20190510040859/https://www.sas.upenn.edu/psych/dahanlab/PDFFiles/dahanCgPsy01.pdf */

export const applyRestScaling = (node: RdlNode, num: number): number => {
  if (node.RDL_rest_s) {
    return node.RDL_rest_s * Math.log10(node.RDL_rest_c * num);
  }
  return 0.0;
};

export const applyWeightScaling = (node: RdlNode, num: number, act_pi: number): number => {
  if (node.RDL_wt_s) {
    return act_pi * (1.0 + act_pi * node.RDL_wt_s * Math.log10(1.0 + num));
  }
  return act_pi;
};

export const applyPostActivationScaling = (node: RdlNode, num: number, exp_act_i: number) => {
  if (node.RDL_post_c) {
    return exp_act_i * Math.log10(node.RDL_post_c + num);
  }
  return 0.0;
};
