// Import the tracejs library
const tracejs = require('tracejs');

async function simulate() {
  // The different phoneme-to-word feedback values we want to simulate
  const feedbackValues = [0, 0.03];

  // Load the lexicon saved to slex_dahan2001.xml
  const lexicon = tracejs.loadJtLexicon('./slex_dahan2001.xml').slice(0, 5); // remove .slice(0, 5) to use full lexicon

  // Create file handles that we can continuously write to over the course of the
  // simulation
  const featureFile = tracejs.openFileHandle('./playground-sim-feature.csv.gz');
  const phonemeFile = tracejs.openFileHandle('./playground-phoneme.csv.gz');
  const wordFile = tracejs.openFileHandle('./playground-sim-word.csv.gz');
  const levelsAndFlowFile = tracejs.openFileHandle('./playground-sim-levels-and-flow.csv.gz');

  // Loop through each word in the lexicon. Each word is an object with the properties:
  //   word.phon = the actual word
  //   word.freq = frequency
  //   word.prime = priming
  //   word.label = word label (optional)
  for (const word of lexicon) {
    // For each word, loop through the 2 feedback values
    for (const feedbackValue of feedbackValues) {
      // Create a new configuration with default values
      const config = tracejs.createDefaultConfig();
  
      // Set the model input of the config object to the word, the lexicon to our loaded lexicon,
      // and the phoneme-to-word feedback value to the current iteration's value.
      config.modelInput = word.phon;
      config.lexicon = lexicon;
      config.alpha.PW = feedbackValue;
  
      // Run a simulation with the config for 30 cycles
      const sim = new tracejs.TraceSim(config);
      sim.cycle(60);
  
      // Write the data to the streams, with the label "abc, def".
      await Promise.all([
        sim.appendFeatureData(featureFile, ['abc', 'def']),
        sim.appendPhonemeData(phonemeFile, ['abc', 'def']),
        sim.appendWordData(wordFile, ['abc', 'def']),
        sim.appendLevelsAndFlowData(levelsAndFlowFile, ['abc', 'def']),
      ]);
    }
  }

  // End the file streams when we're done
  featureFile.end();
  phonemeFile.end();
  wordFile.end();
  levelsAndFlowFile.end();
}

simulate();
