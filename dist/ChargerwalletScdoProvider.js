var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getOrCreateExtInjectedJsBridge } from '@chargerwallet/extension-bridge-injected';
import { ProviderScdoBase } from './ProviderScdoBase';
export var PROVIDER_EVENTS;
(function (PROVIDER_EVENTS) {
    PROVIDER_EVENTS["accountsChanged"] = "accountsChanged";
    PROVIDER_EVENTS["disconnect"] = "disconnect";
    PROVIDER_EVENTS["message_low_level"] = "message_low_level";
})(PROVIDER_EVENTS || (PROVIDER_EVENTS = {}));
export var ScdoRequestMethods;
(function (ScdoRequestMethods) {
    ScdoRequestMethods["scdo_requestAccounts"] = "scdo_requestAccounts";
    ScdoRequestMethods["scdo_disconnect"] = "scdo_disconnect";
    ScdoRequestMethods["scdo_getAccounts"] = "scdo_getAccounts";
    ScdoRequestMethods["scdo_getBalance"] = "scdo_getBalance";
    ScdoRequestMethods["scdo_signTransaction"] = "scdo_signTransaction";
    ScdoRequestMethods["scdo_estimateGas"] = "scdo_estimateGas";
    ScdoRequestMethods["scdo_sendTransaction"] = "scdo_sendTransaction";
})(ScdoRequestMethods || (ScdoRequestMethods = {}));
function isWalletEventMethodMatch({ method, name }) {
    return method === `wallet_events_${name}`;
}
export class ProviderScdo extends ProviderScdoBase {
    constructor(props) {
        super(Object.assign(Object.assign({}, props), { bridge: props.bridge || getOrCreateExtInjectedJsBridge({ timeout: props.timeout }) }));
        this.accounts = [];
        this._registerEvents();
    }
    _registerEvents() {
        window.addEventListener('chargerwallet_bridge_disconnect', () => {
            this._handleDisconnected();
        });
        this.on(PROVIDER_EVENTS.message_low_level, (payload) => {
            if (!payload)
                return;
            const { method, params } = payload;
            if (isWalletEventMethodMatch({ method, name: PROVIDER_EVENTS.accountsChanged })) {
                this._handleAccountChange(params);
            }
        });
    }
    _callBridge(params) {
        return this.bridgeRequest(params);
    }
    _handleDisconnected(options = { emit: true }) {
        this._account = undefined;
        if (options.emit && this.isConnectionStatusChanged('disconnected')) {
            this.connectionStatus = 'disconnected';
            this.emit(PROVIDER_EVENTS.disconnect);
        }
    }
    isAccountsChanged(account) {
        if (!account)
            return false;
        if (!this._account)
            return true;
        return account !== this._account;
    }
    // trigger by bridge account change event
    _handleAccountChange(payload) {
        const account = payload;
        if (this.isAccountsChanged(account) && account) {
            this.emit(PROVIDER_EVENTS.accountsChanged, [account]);
        }
        if (!account) {
            this._handleDisconnected();
            return;
        }
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    removeListener(eventName, listener) {
        return super.removeListener(eventName, listener);
    }
    _transformTx(tx) {
        var _a, _b, _c, _d, _e, _f;
        return {
            Type: 0,
            From: tx.from,
            To: tx.to,
            Amount: (_a = tx.amount) !== null && _a !== void 0 ? _a : 0,
            AccountNonce: (_b = tx.accountNonce) !== null && _b !== void 0 ? _b : 0,
            GasPrice: (_c = tx.gasPrice) !== null && _c !== void 0 ? _c : 1,
            GasLimit: (_d = tx.gasLimit) !== null && _d !== void 0 ? _d : 0,
            Timestamp: (_e = tx.timestamp) !== null && _e !== void 0 ? _e : 0,
            Payload: (_f = tx.payload) !== null && _f !== void 0 ? _f : '',
        };
    }
    request(props) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const reqParams = props.params;
            let params;
            if (props.method === ScdoRequestMethods.scdo_estimateGas) {
                const tx = reqParams[0];
                params = [{
                        Data: this._transformTx(tx),
                        Hash: (_a = tx.hash) !== null && _a !== void 0 ? _a : '',
                        Signature: (_b = tx.signature) !== null && _b !== void 0 ? _b : { Sig: '' },
                    }];
            }
            else if (props.method === ScdoRequestMethods.scdo_signTransaction || props.method === ScdoRequestMethods.scdo_sendTransaction) {
                params = [this._transformTx(props.params[0])];
            }
            else {
                params = reqParams;
            }
            const res = yield this._callBridge({
                method: props.method,
                params,
            });
            if (props.method === ScdoRequestMethods.scdo_getAccounts) {
                this.accounts.length = 0;
                this.accounts.push(...res);
            }
            return res;
        });
    }
}
