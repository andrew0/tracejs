const tracejs = require('tracejs');
const path = require('path');

const feedbackValues = [0, 0.03];
for (const value of feedbackValues) {
  const config = tracejs.createDefaultConfig();
  config.alpha.PW = value;

  const sim = new tracejs.TraceSim(config);
  sim.cycle(30);

  const dir = path.join(__dirname, 'pw_' + value.toString());
  sim.writeFiles(dir);
}
