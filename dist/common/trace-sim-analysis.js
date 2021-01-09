"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAnalysis = exports.doSimAnalysis = exports.TraceCompetitionType = exports.TraceChoice = exports.TraceCalculationType = exports.TraceContentType = exports.TraceDomain = void 0;
const response_probability_1 = require("./response-probability");
const util = __importStar(require("./util"));
/** are we watching phonemes or words? */
var TraceDomain;
(function (TraceDomain) {
    TraceDomain[TraceDomain["PHONEMES"] = 0] = "PHONEMES";
    TraceDomain[TraceDomain["WORDS"] = 1] = "WORDS";
})(TraceDomain = exports.TraceDomain || (exports.TraceDomain = {}));
/** graph contents */
var TraceContentType;
(function (TraceContentType) {
    TraceContentType[TraceContentType["RESPONSE_PROBABILITIES"] = 0] = "RESPONSE_PROBABILITIES";
    TraceContentType[TraceContentType["ACTIVATIONS"] = 1] = "ACTIVATIONS";
    TraceContentType[TraceContentType["COMPETITION_INDEX"] = 2] = "COMPETITION_INDEX";
})(TraceContentType = exports.TraceContentType || (exports.TraceContentType = {}));
/** how alignment works */
var TraceCalculationType;
(function (TraceCalculationType) {
    TraceCalculationType[TraceCalculationType["AVERAGE"] = 0] = "AVERAGE";
    TraceCalculationType[TraceCalculationType["MAX_POSTHOC"] = 1] = "MAX_POSTHOC";
    TraceCalculationType[TraceCalculationType["STATIC"] = 2] = "STATIC";
    TraceCalculationType[TraceCalculationType["FRAUENFELDER"] = 3] = "FRAUENFELDER";
    TraceCalculationType[TraceCalculationType["MAX_ADHOC"] = 4] = "MAX_ADHOC";
    TraceCalculationType[TraceCalculationType["MAX_ADHOC_2"] = 5] = "MAX_ADHOC_2";
})(TraceCalculationType = exports.TraceCalculationType || (exports.TraceCalculationType = {}));
/** how choice works */
var TraceChoice;
(function (TraceChoice) {
    TraceChoice[TraceChoice["NORMAL"] = 0] = "NORMAL";
    TraceChoice[TraceChoice["FORCED"] = 1] = "FORCED";
})(TraceChoice = exports.TraceChoice || (exports.TraceChoice = {}));
var TraceCompetitionType;
(function (TraceCompetitionType) {
    TraceCompetitionType[TraceCompetitionType["RAW"] = 0] = "RAW";
    TraceCompetitionType[TraceCompetitionType["FIRST_DERIVATIVE"] = 1] = "FIRST_DERIVATIVE";
    TraceCompetitionType[TraceCompetitionType["SECOND_DERIVATIVE"] = 2] = "SECOND_DERIVATIVE";
})(TraceCompetitionType = exports.TraceCompetitionType || (exports.TraceCompetitionType = {}));
/**
 * Get indices into the second arg for items that match an element in the
 * first arg.
 */
const itemsToArrayIndices = (items, compare) => {
    const result = [];
    for (const item of items) {
        for (const idx in compare) {
            if (item == compare[idx]) {
                result.push(idx);
            }
        }
    }
    return result;
};
const averagingOp = (data, midIndex, width) => {
    let res = 0;
    let tick = 0;
    for (let i = midIndex - Math.floor(width / 2); i < midIndex + Math.floor(width / 2); i++) {
        if (i < 0)
            continue;
        if (i >= data.length)
            break;
        res += data[i];
        tick++;
    }
    res /= tick;
    return res;
};
const makeXAxis = (len) => {
    let res = [];
    for (let i = 1; i <= len + 1; i++) {
        res[i - 1] = i;
    }
    return res;
};
const slopeRegress = (dat, width, length) => {
    /*
     * to do the regression line, for the compet slope stuff, use:
     * b = SUM[(x-avg(x))(y-avg(y))] / SUM[(x-avg(x))^2]
     **/
    const deriv = [];
    const xAxis = makeXAxis(length);
    for (let iCI = 0; iCI < length - 1; iCI++) {
        let sumxyCI = 0, sumxxCI = 0;
        let idxCI; //tickCI=0;
        for (let jCI = Math.floor(-width / 2); jCI < width / 2 && jCI < dat.length; jCI++) {
            idxCI = iCI + jCI;
            if (idxCI < 0)
                continue;
            if (idxCI >= xAxis.length)
                break;
            sumxyCI +=
                (xAxis[idxCI] - averagingOp(xAxis, iCI, width)) *
                    (dat[idxCI] - averagingOp(dat, iCI, width));
            sumxxCI +=
                (xAxis[idxCI] - averagingOp(xAxis, iCI, width)) *
                    (xAxis[idxCI] - averagingOp(xAxis, iCI, width));
        }
        //System.out.println(iCI+"\tb="+(sumxyCI/sumxxCI)+" = "+sumxyCI+" / "+sumxxCI+" ["+dat[iCI]+"]");
        deriv[iCI] = sumxyCI / sumxxCI;
    }
    return deriv;
};
const discoverItemsToWatch = (config) => {
    const itemsToWatch = config.domain == TraceDomain.WORDS
        ? config.sim.config.lexicon.map((x) => x.phon)
        : config.sim.phonemes.sorted().map((x) => x.label);
    const datasets = exports.doSimAnalysis(Object.assign(Object.assign({}, config), { itemsToWatch }));
    return datasets
        .map((dataset, index) => [dataset, itemsToWatch[index]]) // zip dataset and itemsToWatch
        .sort(([a], [b]) => Math.max(...b.data.map((point) => point.y)) - Math.max(...a.data.map((point) => point.y))) // sort desc by max Y value
        .slice(0, +config.itemsToWatch) // take top N values
        .map(([_, itemToWatch]) => itemToWatch); // return the itemsToWatch value
};
/**
 * Creates a new instance of TraceAnalysis.
 * @param sim             TraceSim object
 * @param domain          PHONEMES or WORDS
 * @param watchType
 * @param itemsToWatch    items to watch (Vector of chars, Vector of TraceWords, or null)
 * @param watchTopN       0 to use items, or otherwise N
 * @param calculationType AVERAGE, MAX_ADHOC, MAX_ADHOC2, MAX_POSTHOC, STATIC, or FRAUNFELDER
 * @param alignment       if alignment == STATIC
 * @param choice          NORMAL or FORCED
 * @param kValue          LCR exponent (if 0, use activations)
 */
exports.doSimAnalysis = (config) => {
    const { sim, domain = TraceDomain.WORDS, itemsToWatch = 10, calculationType = TraceCalculationType.STATIC, alignment = 4, choice = TraceChoice.NORMAL, kValue = 4, competType = TraceCompetitionType.RAW, competSlope = 1, } = config;
    let contentType;
    if (kValue < 0) {
        contentType = TraceContentType.COMPETITION_INDEX;
    }
    else if (kValue === 0) {
        contentType = TraceContentType.ACTIVATIONS;
    }
    else {
        contentType = TraceContentType.RESPONSE_PROBABILITIES;
    }
    const dataSetLength = sim.getStepsRun();
    if (dataSetLength == 0)
        return [];
    if (contentType == TraceContentType.RESPONSE_PROBABILITIES ||
        contentType == TraceContentType.ACTIVATIONS) {
        // figure out what we're analyzing
        let items;
        if (!Array.isArray(itemsToWatch)) {
            // we don't want to update the object's list -- that's bad form...
            items = discoverItemsToWatch(config);
        }
        else {
            //watchType == WATCHSPECIFIED
            items = itemsToWatch;
        }
        //const items = domain == TraceDomain.WORDS ? sim.config.lexicon.map(x => x.phon) : sim.phonemes.sorted().map(x => x.label)
        // short-circuit if nothing to analyze!
        if (items.length == 0)
            return [];
        // set up data and indexes
        let itemIndices;
        let activationData;
        if (domain == TraceDomain.WORDS) {
            itemIndices = itemsToArrayIndices(items, sim.config.lexicon.map((x) => x.phon));
            activationData = sim.wordLayer;
        }
        else {
            //if(domain==PHONEMES){
            itemIndices = itemsToArrayIndices(items, sim.phonemes.sorted().map((x) => x.label));
            activationData = sim.phonLayer;
        }
        let numDataSets = activationData[0].length;
        let numSlices = Math.floor(sim.config.fSlices / sim.config.slicesPerPhon);
        // we only need responseStrength for plotting response probabilities
        let responseStrengthData = util.zeros3D(dataSetLength, numDataSets, numSlices);
        if (contentType == TraceContentType.RESPONSE_PROBABILITIES) {
            // built the matrix
            for (let iDSL = 0; iDSL < dataSetLength; iDSL++) {
                for (let iNDS = 0; iNDS < numDataSets; iNDS++) {
                    for (let iSlice = 0; iSlice < numSlices; iSlice++) {
                        const d = activationData[iDSL][iNDS][iSlice];
                        // convert it to proportion possible activation
                        // d = (d - param.getMin() ) / (param.getMax() - param.getMin());
                        // do k-value
                        responseStrengthData[iDSL][iNDS][iSlice] = Math.exp(d * (kValue || 1));
                        if (sim.config.freqNode.RDL_post_c && domain == TraceDomain.WORDS) {
                            // From JSM modified TRACE code : S_i =  SWP_i =  e^(k*a_i) * [log 10( c +  f_i )]
                            responseStrengthData[iDSL][iNDS][iSlice] = response_probability_1.applyPostActivationScaling(sim.config.freqNode, sim.config.lexicon[iNDS].freq, responseStrengthData[iDSL][iNDS][iSlice]);
                        }
                    }
                }
            }
        }
        // set up alignment matricies if needed
        // NB: responseStrength is a monotonic transformation of activationData, so
        // max operations are equivalent. So, we can calculate these alignment
        // matricies regardless of whether we want activations or response strengths.
        const alignmentAdHoc = util.zeros2D(numDataSets, dataSetLength); // int
        const alignmentPostHoc = Array(numDataSets).fill(0); // int
        if (calculationType == TraceCalculationType.MAX_ADHOC) {
            // foreach item
            for (let iNDS = 0; iNDS < numDataSets; iNDS++) {
                for (let iDSL = 0; iDSL < dataSetLength; iDSL++) {
                    // find the alignment that maximizes activation for a particular cycle
                    let bestActivation = -1000;
                    for (let iSlices = 0; iSlices < numSlices; iSlices++) {
                        if (activationData[iDSL][iNDS][iSlices] > bestActivation) {
                            bestActivation = activationData[iDSL][iNDS][iSlices];
                            alignmentAdHoc[iNDS][iDSL] = iSlices;
                        }
                    }
                }
            }
        }
        // MAX_ADHOC_2 IS IDENTICAL TO MAX_ADHOC IN THIS PART
        else if (calculationType == TraceCalculationType.MAX_ADHOC_2) {
            // foreach item
            for (let iNDS = 0; iNDS < numDataSets; iNDS++) {
                for (let iDSL = 0; iDSL < dataSetLength; iDSL++) {
                    // find the alignment that maximizes activation for a particular cycle
                    let bestActivation = -1000;
                    for (let iSlices = 0; iSlices < numSlices; iSlices++) {
                        if (activationData[iDSL][iNDS][iSlices] > bestActivation) {
                            bestActivation = activationData[iDSL][iNDS][iSlices];
                            alignmentAdHoc[iNDS][iDSL] = iSlices;
                        }
                    }
                }
            }
        }
        else if (calculationType == TraceCalculationType.MAX_POSTHOC) {
            // foreach item
            for (let iNDS = 0; iNDS < numDataSets; iNDS++) {
                // find the alignment that maximizes activation over all cycles
                let bestActivation = -1000;
                for (let iDSL = 0; iDSL < dataSetLength; iDSL++) {
                    for (let iSlices = 0; iSlices < numSlices; iSlices++) {
                        if (activationData[iDSL][iNDS][iSlices] > bestActivation) {
                            bestActivation = activationData[iDSL][iNDS][iSlices];
                            alignmentPostHoc[iNDS] = iSlices;
                        }
                    }
                }
            }
        }
        // now, calculate the denominators
        let denominator = Array(dataSetLength).fill(0);
        // denominatorTwo is used if the alignment differs depending on the item;
        // so: denominatorTwo[cycle][item]
        let denominatorTwo = util.zeros2D(dataSetLength, numDataSets);
        if (contentType == TraceContentType.RESPONSE_PROBABILITIES) {
            for (let iDSL = 0; iDSL < dataSetLength; iDSL++) {
                denominator[iDSL] = 0;
                if (choice == TraceChoice.NORMAL) {
                    switch (calculationType) {
                        case TraceCalculationType.AVERAGE:
                            for (let iSlices = 0; iSlices < numSlices; iSlices++) {
                                for (let iNDS = 0; iNDS < numDataSets; iNDS++) {
                                    denominator[iDSL] += responseStrengthData[iDSL][iNDS][iSlices];
                                }
                            }
                            break;
                        case TraceCalculationType.MAX_ADHOC:
                            //in this case, the same alignment selected for target 'ii' is used for all competitor items
                            for (let iNDS = 0; iNDS < numDataSets; iNDS++) {
                                for (let iiNDS = 0; iiNDS < numDataSets; iiNDS++) {
                                    // for this item (iDSL) and cycle (iiNDS), we know the alignment
                                    denominatorTwo[iDSL][iiNDS] +=
                                        responseStrengthData[iDSL][iNDS][alignmentAdHoc[iiNDS][iDSL]];
                                }
                            }
                            break;
                        case TraceCalculationType.MAX_ADHOC_2:
                            //in this case, the alignment selected for target 'ii' is NOT used for all competitor items
                            //instead, each competitor 'i' uses its own MAX_ADHOC discovered alignment
                            //these are just different ways of considering competition mechanisms, none of which have
                            //much empirical basis.  but see Vroomen & Van Gelder (1995, 1997)
                            for (let iNDS = 0; iNDS < numDataSets; iNDS++) {
                                for (let iiNDS = 0; iiNDS < numDataSets; iiNDS++) {
                                    // for this item (iDSL) and cycle (iiNDS), we know the alignment
                                    //DIFFERENCE BETWEEN MAX_ADHOC AND MAX_ADHOC_2 OCCURS HERE: alignmentAdHoc[iNDS][iDSL] VERSUS alignmentAdHoc[iiNDS][iDSL]
                                    denominatorTwo[iDSL][iiNDS] +=
                                        responseStrengthData[iDSL][iNDS][alignmentAdHoc[iNDS][iDSL]];
                                }
                            }
                            break;
                        case TraceCalculationType.MAX_POSTHOC:
                            for (let iNDS = 0; iNDS < numDataSets; iNDS++) {
                                //for (int iiNDS = 0; iiNDS < numDataSets; iiNDS++)
                                {
                                    //denominatorTwo[iDSL][iiNDS] += responseStrengthData[iDSL][iNDS][alignmentPostHoc[iiNDS]]
                                    denominator[iDSL] += responseStrengthData[iDSL][iNDS][alignmentPostHoc[iNDS]];
                                }
                            }
                            break;
                        case TraceCalculationType.STATIC:
                            for (let iNDS = 0; iNDS < numDataSets; iNDS++) {
                                denominator[iDSL] += responseStrengthData[iDSL][iNDS][alignment];
                            }
                            break;
                        case TraceCalculationType.FRAUENFELDER:
                            // iDSL is the index to a particular cycle of the model
                            // iNDS is the index to an item (word/phoneme) to be graphed
                            // iiNDS is the index to the potential competitors of iNDS
                            // competAlign is an index to an alignment (time slice)
                            // alignment is the user-specified alignment
                            // for all items and competitors of those items,
                            for (let iNDS = 0; iNDS < numDataSets; iNDS++) {
                                for (let iiNDS = 0; iiNDS < numDataSets; iiNDS++) {
                                    // for all possible alignments
                                    for (let competAlign = 0; competAlign < numSlices; competAlign++) {
                                        if (domain == TraceDomain.WORDS) {
                                            // calculate length (in slices) of this word, and its currently examined competitor
                                            const wordExtent = Math.floor(sim.config.deltaInput / sim.config.slicesPerPhon) *
                                                sim.config.lexicon[iNDS].phon.length;
                                            const competExtent = Math.floor(sim.config.deltaInput / sim.config.slicesPerPhon) *
                                                sim.config.lexicon[iiNDS].phon.length;
                                            // if the word and the competitor overlap
                                            if (alignment == competAlign ||
                                                (competAlign > alignment && alignment + wordExtent >= competAlign) ||
                                                (competAlign < alignment && competAlign + competExtent >= alignment)) {
                                                // collect two-dimensional denominator info, ala Post-Hoc and Ad-Hoc.
                                                // varies depending on both cycle and item.
                                                denominatorTwo[iDSL][iNDS] +=
                                                    responseStrengthData[iDSL][iiNDS][competAlign];
                                            }
                                            //if(((alignment<=(competAlign+competExtent))&&alignment>=competAlign&&competExtent>0&&wordExtent>0)||
                                            //   ((competAlign<=(alignment+wordExtent))&&competAlign>=alignment&&competExtent>0&&wordExtent>0))
                                            //    denominatorTwo[iDSL][iNDS] += responseStrengthData[iDSL][iiNDS][competAlign];
                                        }
                                        else {
                                            // domain == PHONEMES
                                            // here, just use this phoneme and its neighbors
                                            if (competAlign == alignment ||
                                                competAlign == alignment - 1 ||
                                                competAlign == alignment + 1)
                                                denominatorTwo[iDSL][iNDS] += responseStrengthData[iDSL][iNDS][competAlign];
                                        }
                                    }
                                }
                            }
                            break;
                    }
                }
                else if (choice == TraceChoice.FORCED) {
                    // similar, but now instead of adding all items (iNDS), just loop/add
                    // over the ones we're analyzing
                    switch (calculationType) {
                        case TraceCalculationType.AVERAGE:
                            for (let iSlices = 0; iSlices < numSlices; iSlices++) {
                                for (let iII = 0; iII < itemIndices.length; iII++) {
                                    denominator[iDSL] += responseStrengthData[iDSL][itemIndices[iII]][iSlices];
                                }
                            }
                            break;
                        case TraceCalculationType.MAX_ADHOC:
                            for (let iII = 0; iII < itemIndices.length; iII++) {
                                for (let iiII = 0; iiII < itemIndices.length; iiII++) {
                                    denominatorTwo[iDSL][itemIndices[iII]] +=
                                        responseStrengthData[iDSL][itemIndices[iiII]][alignmentAdHoc[itemIndices[iII]][iDSL]];
                                }
                            }
                            break;
                        case TraceCalculationType.MAX_ADHOC_2:
                            for (let iII = 0; iII < itemIndices.length; iII++) {
                                for (let iiII = 0; iiII < itemIndices.length; iiII++) {
                                    denominatorTwo[iDSL][itemIndices[iII]] +=
                                        responseStrengthData[iDSL][itemIndices[iiII]][alignmentAdHoc[itemIndices[iII]][iDSL]];
                                }
                            }
                            break;
                        case TraceCalculationType.MAX_POSTHOC:
                            for (let iII = 0; iII < itemIndices.length; iII++) {
                                //for (int iiII = 0; iiII < itemIndices.length; iiII++)
                                {
                                    //denominatorTwo[iDSL][itemIndices[iII]] += responseStrengthData[iDSL][itemIndices[iiII]][alignmentPostHoc[itemIndices[iII]]];
                                    denominator[iDSL] +=
                                        responseStrengthData[iDSL][itemIndices[iII]][alignmentPostHoc[itemIndices[iII]]];
                                }
                            }
                            break;
                        case TraceCalculationType.STATIC:
                            for (let iII = 0; iII < itemIndices.length; iII++) {
                                denominator[iDSL] += responseStrengthData[iDSL][itemIndices[iII]][alignment];
                            }
                            break;
                        case TraceCalculationType.FRAUENFELDER:
                            // this too is sorta like AVERAGE, as in NORMAL choice above, except that words have to
                            // both be in the list and overlap
                            //String target = TraceWord.stripDashes(param.getModelInput());
                            //int targetExtent = target.length() * param.getDeltaInput() / param.getSlicesPerPhon();
                            // this is the same idea as with normal choice, above, except iterate only over selected
                            // words/phonemes.
                            for (let iII = 0; iII < itemIndices.length; iII++) {
                                for (let iiII = 0; iiII < itemIndices.length; iiII++) {
                                    for (let competAlign = 0; competAlign < numSlices; competAlign++) {
                                        if (domain == TraceDomain.WORDS) {
                                            const wordExtent = Math.floor(sim.config.deltaInput / sim.config.slicesPerPhon) *
                                                sim.config.lexicon[itemIndices[iII]].phon.length;
                                            const competExtent = Math.floor(sim.config.deltaInput / sim.config.slicesPerPhon) *
                                                sim.config.lexicon[itemIndices[iiII]].phon.length;
                                            // not sure why different logic is used here vs. above... might be a problem.
                                            if ((alignment <= competAlign + competExtent &&
                                                alignment >= competAlign &&
                                                competExtent > 0 &&
                                                wordExtent > 0) ||
                                                (competAlign <= alignment + wordExtent &&
                                                    competAlign >= alignment &&
                                                    competExtent > 0 &&
                                                    wordExtent > 0)) {
                                                denominatorTwo[iDSL][itemIndices[iII]] +=
                                                    responseStrengthData[iDSL][itemIndices[iiII]][competAlign];
                                            }
                                        }
                                        else {
                                            // domain == PHONEMES
                                            if (competAlign == alignment ||
                                                competAlign == alignment - 1 ||
                                                competAlign == alignment + 1)
                                                denominatorTwo[iDSL][itemIndices[iII]] +=
                                                    responseStrengthData[iDSL][itemIndices[iiII]][competAlign];
                                        }
                                    }
                                }
                            }
                            break;
                    }
                }
            }
        }
        // compute the numerator and the plotData
        let plotData = util.zeros2D(itemIndices.length, dataSetLength);
        // loop over items
        for (let iII = 0; iII < itemIndices.length; iII++) {
            // loop over cycles
            for (let iDSL = 0; iDSL < dataSetLength; iDSL++) {
                // compute the numerator
                let numerator = 0;
                let numSrc; // points to either responseStrengthData or activationData;
                if (contentType == TraceContentType.RESPONSE_PROBABILITIES)
                    numSrc = responseStrengthData;
                //(contentType == ACTIVATIONS)
                else
                    numSrc = activationData;
                switch (calculationType) {
                    case TraceCalculationType.AVERAGE:
                        for (let iSlices = 0; iSlices < numSlices; iSlices++) {
                            numerator += numSrc[iDSL][itemIndices[iII]][iSlices];
                        }
                        numerator /= numSlices;
                        break;
                    case TraceCalculationType.MAX_ADHOC:
                        numerator = numSrc[iDSL][itemIndices[iII]][alignmentAdHoc[itemIndices[iII]][iDSL]];
                        break;
                    case TraceCalculationType.MAX_ADHOC_2:
                        numerator = numSrc[iDSL][itemIndices[iII]][alignmentAdHoc[itemIndices[iII]][iDSL]];
                        break;
                    case TraceCalculationType.MAX_POSTHOC:
                        numerator = numSrc[iDSL][itemIndices[iII]][alignmentPostHoc[itemIndices[iII]]];
                        break;
                    case TraceCalculationType.STATIC:
                        numerator = numSrc[iDSL][itemIndices[iII]][alignment];
                        break;
                    case TraceCalculationType.FRAUENFELDER:
                        numerator =
                            numSrc[iDSL][itemIndices[iII]][alignment] +
                                numSrc[iDSL][itemIndices[iII]][alignment + 1]; // @@@ check for array out of bounds
                        break;
                }
                // compute the plotData
                if (contentType == TraceContentType.RESPONSE_PROBABILITIES) {
                    switch (calculationType) {
                        case TraceCalculationType.AVERAGE:
                            plotData[iII][iDSL] = numerator / denominator[iDSL];
                            break;
                        case TraceCalculationType.MAX_ADHOC:
                            plotData[iII][iDSL] = numerator / denominatorTwo[iDSL][itemIndices[iII]];
                            break;
                        case TraceCalculationType.MAX_ADHOC_2:
                            plotData[iII][iDSL] = numerator / denominatorTwo[iDSL][itemIndices[iII]];
                            break;
                        case TraceCalculationType.MAX_POSTHOC:
                            //plotData[iII][iDSL] = numerator / denominatorTwo[iDSL][itemIndices[iII]];
                            plotData[iII][iDSL] = numerator / denominator[iDSL];
                            break;
                        case TraceCalculationType.STATIC:
                            plotData[iII][iDSL] = numerator / denominator[iDSL];
                            break;
                        case TraceCalculationType.FRAUENFELDER:
                            plotData[iII][iDSL] = numerator / denominatorTwo[iDSL][itemIndices[iII]];
                            break;
                        default:
                            break;
                    }
                } //ACTIVATIONS
                else
                    plotData[iII][iDSL] = numerator;
            }
        }
        // convert data to an XYSeriesCollection
        let oneSeries;
        const ret = [];
        for (let iII = 0; iII < itemIndices.length; iII++) {
            // get the name of the series from the lexicon (for purposes of this stub)
            if (domain == TraceDomain.WORDS) {
                if (calculationType == TraceCalculationType.MAX_POSTHOC)
                    oneSeries = {
                        label: `${sim.config.lexicon[itemIndices[iII]].phon} [${alignmentPostHoc[itemIndices[iII]]}]`,
                        data: [],
                    };
                else
                    oneSeries = {
                        label: sim.config.lexicon[itemIndices[iII]].phon,
                        data: [],
                    };
                // if (calculationType == TraceCalculationType.MAX_POSTHOC)
                //   oneSeries.setDescription(oneSeries.getName().concat(" "+alignmentPostHoc[itemIndices[iII]]))
                // else
                //   oneSeries.setDescription(oneSeries.getName())
            }
            else {
                //if(domain == PHONEMES)
                oneSeries = {
                    label: sim.phonemes.sorted()[itemIndices[iII]].label,
                    data: [],
                };
                // if (calculationType == MAX_POSTHOC)
                //   oneSeries.setDescription(oneSeries.getName().concat(" "+alignmentPostHoc[itemIndices[iII]]))
                // else
                //   oneSeries.setDescription(oneSeries.getName())
            }
            for (let iDSL = 0; iDSL < dataSetLength; iDSL++) {
                // X is time step, y is data
                oneSeries.data.push({ x: iDSL, y: plotData[iII][iDSL] });
            }
            ret.push(oneSeries);
        }
        return ret;
    }
    else {
        //if competitionIndex
        // convert data to an XYSeriesCollection
        let oneSeries;
        const ret = [];
        let compIndex;
        if (domain == TraceDomain.WORDS) {
            compIndex = sim.globalLexicalCompetition;
            oneSeries = { label: 'Lexical Competition', data: [] };
        }
        else {
            compIndex = sim.globalPhonemeCompetition;
            oneSeries = { label: 'Phoneme Competition', data: [] };
        }
        if (competType == TraceCompetitionType.RAW) {
            // competIndex, raw, not a slope line
            for (let iDSL = 0; iDSL < dataSetLength; iDSL++) {
                // X is time step, y is data
                //System.out.println("add\t"+iDSL+"\t"+compIndex[iDSL]);
                oneSeries.data.push({ x: iDSL, y: compIndex[iDSL] });
            }
            ret.push(oneSeries);
        }
        else if (competType == TraceCompetitionType.FIRST_DERIVATIVE) {
            // first derivative
            const firstDeriv = slopeRegress(compIndex, competSlope, dataSetLength);
            for (let iDSL = 0; iDSL < firstDeriv.length; iDSL++) {
                // X is time step, y is data
                //System.out.println("add\t"+iDSL+"\t"+firstDeriv[iDSL]);
                oneSeries.data.push({ x: iDSL, y: firstDeriv[iDSL] });
            }
            ret.push(oneSeries);
        }
        else if (competType == TraceCompetitionType.SECOND_DERIVATIVE) {
            // second derivative
            const firstDeriv = slopeRegress(compIndex, competSlope, dataSetLength - 1);
            const secondDeriv = slopeRegress(firstDeriv, competSlope, dataSetLength - 2);
            for (let iDSL = 0; iDSL < secondDeriv.length; iDSL++) {
                // X is time step, y is data
                oneSeries.data.push({ x: iDSL, y: secondDeriv[iDSL] });
            }
            ret.push(oneSeries);
        }
        return ret;
    }
};
exports.formatAnalysis = (data, padLabels = false) => {
    if (data.length > 0) {
        return [
            // first row is 'cycle', then lexicon labels, joined by a tab
            ['cycle', ...data.map((x) => (padLabels ? x.label.padEnd(18) : x.label))].join('\t'),
            // data[0].data.length is # of cycles
            // create row for each cycle, each row contains cycle number, then y value
            ...Array.from(Array(data[0].data.length), (_, cycle) => [cycle, ...data.map((x) => x.data[cycle].y.toFixed(18))].join('\t')),
        ].join('\n');
    }
    return '';
};
//# sourceMappingURL=trace-sim-analysis.js.map