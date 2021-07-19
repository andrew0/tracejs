import { createDefaultConfig, TraceSim } from '..';

test('output does not change unexpectedly', () => {
  const config = createDefaultConfig();
  const sim = new TraceSim(config);
  sim.cycle(15);
  expect(sim.getAllInputData()).toMatchSnapshot();
  expect(sim.getAllFeatureData()).toMatchSnapshot();
  expect(sim.getAllPhonemeData()).toMatchSnapshot();
  expect(sim.getAllWordData()).toMatchSnapshot();
  expect(sim.getAllLevelsAndFlowData()).toMatchSnapshot();
});
