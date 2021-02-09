const tracejs = require('tracejs');

const feedbackValues = [0, 0.03];
const lexicon = tracejs.loadJtLexicon('./slex_dahan2001.xml').slice(0, 5); // remove .slice(0, 5) to use full lexicon

for (const word of lexicon) {
  for (const feedbackValue of feedbackValues) {
    const config = tracejs.createDefaultConfig();
    config.modelInput = word.phon;
    config.lexicon = lexicon;
    config.alpha.PW = feedbackValue;
  
    const sim = new tracejs.TraceSim(config);
    sim.cycle(30);
  
    sim.writeFiles(process.cwd(), `${word.phon}_${feedbackValue}`);
  }
}
