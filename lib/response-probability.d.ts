import { RdlNode } from './trace-param';
export declare const applyRestScaling: (node: RdlNode, num: number) => number;
export declare const applyWeightScaling: (node: RdlNode, num: number, act_pi: number) => number;
export declare const applyPostActivationScaling: (node: RdlNode, num: number, exp_act_i: number) => number;
