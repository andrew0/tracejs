"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tests the output with default config parameters
const trace_param_1 = require("../trace-param");
const trace_sim_1 = __importDefault(require("../trace-sim"));
const jest_matcher_deep_close_to_1 = require("jest-matcher-deep-close-to");
expect.extend({ toBeDeepCloseTo: jest_matcher_deep_close_to_1.toBeDeepCloseTo, toMatchCloseTo: jest_matcher_deep_close_to_1.toMatchCloseTo });
// not sure if this is the best way to do things...
// see jest.config.js for file path mapping
// 'data/(.+)\.json': '<rootDir>/src/__tests__/data/$1.json'
const expected = require('data/default-sim.json');
describe('simulation with default configuration', () => {
    // run the simulation
    const sim = new trace_sim_1.default(trace_param_1.createDefaultConfig());
    sim.cycle(20);
    const data = {
        inputLayer: sim.inputLayer,
        featLayer: sim.featLayer,
        phonLayer: sim.phonLayer,
        wordLayer: sim.wordLayer
    };
    test('should run 20 cycles', () => {
        expect(data.inputLayer.length).toBe(20);
        expect(data.featLayer.length).toBe(20);
        expect(data.phonLayer.length).toBe(20);
        expect(data.wordLayer.length).toBe(20);
    });
    test('should be equal to jTRACE data', () => {
        // @ts-ignore
        expect(data).toBeDeepCloseTo(expected, 6);
    });
});
//# sourceMappingURL=default-sim.js.map