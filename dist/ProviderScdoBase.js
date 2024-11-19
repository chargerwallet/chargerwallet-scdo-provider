import { IInjectedProviderNames } from '@chargerwallet/cross-inpage-provider-types';
import { ProviderBase } from '@chargerwallet/cross-inpage-provider-core';
class ProviderScdoBase extends ProviderBase {
    constructor(props) {
        super(props);
        this.providerName = IInjectedProviderNames.scdo;
    }
    request(data) {
        return this.bridgeRequest(data);
    }
}
export { ProviderScdoBase };
