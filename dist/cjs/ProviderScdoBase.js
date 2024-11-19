"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderScdoBase = void 0;
const cross_inpage_provider_types_1 = require("@chargerwallet/cross-inpage-provider-types");
const cross_inpage_provider_core_1 = require("@chargerwallet/cross-inpage-provider-core");
class ProviderScdoBase extends cross_inpage_provider_core_1.ProviderBase {
    constructor(props) {
        super(props);
        this.providerName = cross_inpage_provider_types_1.IInjectedProviderNames.scdo;
    }
    request(data) {
        return this.bridgeRequest(data);
    }
}
exports.ProviderScdoBase = ProviderScdoBase;
