
# tracejs
TRACE is a model of speech perception based on James McClelland and Jeffrey Elman's research. This module is a port of the jTRACE implementation, which can be located [here](https://magnuson.psy.uconn.edu/jtrace/). From the link:

> TRACE is a highly influential model of speech perception and spoken word recognition, created by Jay McClelland and Jeff Elman (1986). The original implementation of that model was used to run dozens of simulations comparing TRACE’s behavior with results from experimental studies with human subjects. TRACE’s behavior accounted for human behavior in a number of important ways, and it is still frequently cited as the canonical _interactive-activation_ model of speech perception and spoken word recognition. TRACE has proved remarkably robust, accounting for results in paradigms that were developed 10 years after the model (e.g., fine-grained time course measures from eye tracking).

This module is capable of running the raw simulations, with a user interface made using Vue.js available [here](https://github.com/andrew0/tracejs-vue).

To programmatically run simulations, you can either install the module locally and run a script in Node, or use the `tracejs` utility application to automatically import the tracejs module. Running the `tracejs` command will launch a Node REPL interface with the module automatically loaded into the variable `tracejs`. For example:

```
$ tracejs
> const config = tracejs.createDefaultConfig() // tracejs variable already loaded
undefined
> const sim = new tracejs.TraceSim(config)
phon 0: -
phon 1: ^
phon 2: a
phon 3: b
phon 4: d
phon 5: g
phon 6: i
phon 7: k
phon 8: l
phon 9: p
phon 10: r
phon 11: s
phon 12: S
phon 13: t
phon 14: u
TraceNet.createInput: phons=-^br^pt-
undefined
> sim.cycle(60)
undefined
```

The values of the input, feature, phoneme, and word layers can then be accessed by the properties `sim.inputLayer`, `sim.featLayer`, `sim.phonLayer`, and `sim.wordLayer`. Each layer has an array indexed by cycle number.

## Project setup

```
npm install
```

### Compile TypeScript to JavaScript

```
npm run build
```

### Run  tests

```
npm run test
```
