// Import the tracejs library
const tracejs = require('tracejs');

// Import lexicon and phonology
const lexicon = require('./lexicon');
const phonology = require('./phonology');

async function simulate() {
  // The different phoneme-to-word feedback values we want to simulate
  const feedbackValues = [0, 0.03];

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
  // NOTE: added .slice(5) to limit it to the first 5 since this takes a really long time otherwise
  for (const word of lexicon.slice(5)) {
    // For each word, loop through the 2 feedback values
    for (const feedbackValue of feedbackValues) {
      // Create a new configuration with default values
      const config = tracejs.createDefaultConfig();
  
      // Set the model input of the config object to the word, the lexicon to our loaded lexicon,
      // the phonology to our loaded phonolgoy, and the phoneme-to-word feedback value to the current
      // iteration's value.
      config.continuaPerFeature = 3;
      config.numFeatures = 30;
      config.modelInput = word.phon;
      config.lexicon = lexicon;
      config.phonology = phonology;
      config.alpha.PW = feedbackValue;
  
      // Run a simulation with the config for 30 cycles
      const sim = new tracejs.TraceSim(config);
      sim.cycle(15);
  
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
