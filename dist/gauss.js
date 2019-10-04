"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Gauss {
    constructor(mu, sigma) {
        this.mu = mu;
        this.sigma = sigma;
        this.generate = false;
    }
    next() {
        this.generate = !this.generate;
        if (!this.generate) {
            return this.z1 * this.sigma + this.mu;
        }
        let u1 = 0, u2 = 0;
        while (u1 === 0)
            u1 = Math.random();
        while (u2 === 0)
            u2 = Math.random();
        let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        this.z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        return z0 * this.sigma + this.mu;
    }
}
exports.default = Gauss;
//# sourceMappingURL=gauss.js.map