// We can't import filesystem modules in the browser, so we shim trace-sim.js
// with trace-sim-browser.js (see the "browser" field in package.json)
import TraceSimBase from '../trace-sim-base';

export default class TraceSim extends TraceSimBase {
  writeFiles() {}

  async appendInputData() {}

  async appendFeatureData() {}

  async appendPhonemeData() {}

  async appendWordData() {}

  async appendLevelsAndFlowData() {}

  async appendFiles() {}
}
