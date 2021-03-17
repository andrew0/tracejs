// Import the tracejs library
const tracejs = require('tracejs');

// The different phoneme-to-word feedback values we want to simulate
const feedbackValues = [0, 0.03];

// Load the lexicon saved to slex_dahan2001.xml
const lexicon = tracejs.loadJtLexicon('./slex_dahan2001.xml').slice(0, 5); // remove .slice(0, 5) to use full lexicon

// Create file handles that we can continuously write to over the course of the
// simulation
const files = tracejs.openFileHandles(process.cwd(), 'playground-sim');

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
    sim.cycle(30);

    // Write the data to the stream, with the label "abc, def".
    sim.appendFiles(files, ['abc', 'def']);
  }
}

// End the file streams when we're done
tracejs.closeFileHandles(files);
