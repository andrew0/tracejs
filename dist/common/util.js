"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gauss = exports.clamp = exports.copy2D = exports.zeros3D = exports.zeros2D = exports.average = void 0;
exports.average = (array) => array.reduce((a, b) => a + b) / array.length;
exports.zeros2D = (rows, cols) => Array.from(Array(rows), (_) => Array(cols).fill(0));
exports.zeros3D = (x, y, z) => Array.from(Array(x), (_) => {
    return Array.from(Array(y), (_) => Array(z).fill(0));
});
exports.copy2D = (arr) => arr.map((x) => [...x]);
exports.clamp = (num, min, max) => Math.min(Math.max(num, min), max);
exports.gauss = (mean, sd) => {
    let u = 0, v = 0;
    while (u === 0)
        u = Math.random();
    while (v === 0)
        v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * sd + mean;
};
//# sourceMappingURL=util.js.map