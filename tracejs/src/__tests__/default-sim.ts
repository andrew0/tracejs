// tests the output with default config parameters
import { createDefaultConfig } from '../trace-param'
import TraceSim from '../trace-sim'
import { toBeDeepCloseTo,toMatchCloseTo } from 'jest-matcher-deep-close-to';
expect.extend({ toBeDeepCloseTo, toMatchCloseTo })

// not sure if this is the best way to do things...
// see jest.config.js for file path mapping
// 'data/(.+)\.json': '<rootDir>/src/__tests__/data/$1.json'
const expected = require('data/default-sim.json')

describe('simulation with default configuration', () => {
  // run the simulation
  const sim = new TraceSim(createDefaultConfig())
  sim.cycle(20)
  const data = {
    inputLayer: sim.inputLayer,
    featLayer: sim.featLayer,
    phonLayer: sim.phonLayer,
    wordLayer: sim.wordLayer
  }

  test('should run 20 cycles', () => {
    expect(data.inputLayer.length).toBe(20)
    expect(data.featLayer.length).toBe(20)
    expect(data.phonLayer.length).toBe(20)
    expect(data.wordLayer.length).toBe(20)  
  })

  test('should be equal to jTRACE data', () => {
    // @ts-ignore
    expect(data).toBeDeepCloseTo(expected, 6)
  })
})
