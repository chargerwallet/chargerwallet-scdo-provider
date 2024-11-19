import type { IInpageProviderConfig } from '@chargerwallet/cross-inpage-provider-core';
import { ProviderScdoBase } from './ProviderScdoBase';
import type { IJsonRpcRequest } from '@chargerwallet/cross-inpage-provider-types';
export declare enum PROVIDER_EVENTS {
    accountsChanged = "accountsChanged",
    disconnect = "disconnect",
    message_low_level = "message_low_level"
}
type ScdoProviderEventsMap = {
    [PROVIDER_EVENTS.accountsChanged]: (accounts: string[]) => void;
    [PROVIDER_EVENTS.disconnect]: () => void;
    [PROVIDER_EVENTS.message_low_level]: (payload: IJsonRpcRequest) => void;
};
export declare enum ScdoRequestMethods {
    scdo_requestAccounts = "scdo_requestAccounts",
    scdo_disconnect = "scdo_disconnect",
    scdo_getAccounts = "scdo_getAccounts",
    scdo_getBalance = "scdo_getBalance",
    scdo_signTransaction = "scdo_signTransaction",
    scdo_estimateGas = "scdo_estimateGas",
    scdo_sendTransaction = "scdo_sendTransaction"
}
export interface Tx {
    from: string;
    to: string;
    amount?: number;
    accountNonce?: number;
    gasPrice?: number;
    gasLimit?: number;
    timestamp?: number;
    payload?: string;
    hash?: string;
    signature?: {
        Sig: string;
    };
}
export interface RawTransaction {
    Type: number;
    From: string;
    To: string;
    Amount: number;
    AccountNonce: number;
    GasPrice: number;
    GasLimit: number;
    Timestamp: number;
    Payload: string;
}
export interface SignedTx {
    Data: RawTransaction;
    Hash: string;
    Signature: {
        Sig: string;
    };
}
type ScdoRequest = {
    [ScdoRequestMethods.scdo_requestAccounts]: () => string[];
    [ScdoRequestMethods.scdo_disconnect]: () => void;
    [ScdoRequestMethods.scdo_getAccounts]: () => string[];
    [ScdoRequestMethods.scdo_getBalance]: (address: string, blockHash?: string, blockHeight?: number) => string;
    [ScdoRequestMethods.scdo_signTransaction]: (tx: Tx) => SignedTx;
    [ScdoRequestMethods.scdo_estimateGas]: (tx: Tx) => string;
    [ScdoRequestMethods.scdo_sendTransaction]: (tx: Tx) => SignedTx;
};
type ScdoRequestParams = Parameters<ScdoRequest[ScdoRequestMethods]>;
type ScdoRequestResponse = ReturnType<ScdoRequest[ScdoRequestMethods]>;
interface ScdoRequestProps {
    method: ScdoRequestMethods;
    params: ScdoRequestParams;
}
export type IProviderScdo = {
    on: <E extends keyof ScdoProviderEventsMap>(event: E, cb: ScdoProviderEventsMap[E]) => void;
    removeListener: <E extends keyof ScdoProviderEventsMap>(event: E, cb: ScdoProviderEventsMap[E]) => void;
    request: (props: ScdoRequestProps) => Promise<ScdoRequestResponse>;
};
export type ChargerWalletScdoProviderProps = IInpageProviderConfig & {
    timeout?: number;
};
export declare class ProviderScdo extends ProviderScdoBase implements IProviderScdo {
    private _account?;
    accounts: string[];
    constructor(props: ChargerWalletScdoProviderProps);
    private _registerEvents;
    private _callBridge;
    private _handleDisconnected;
    isAccountsChanged(account: string | undefined): boolean;
    private _handleAccountChange;
    on<E extends keyof ScdoProviderEventsMap>(event: E, listener: ScdoProviderEventsMap[E]): this;
    emit<E extends keyof ScdoProviderEventsMap>(event: E, ...args: Parameters<ScdoProviderEventsMap[E]>): boolean;
    removeListener<E extends keyof ScdoProviderEventsMap>(eventName: E, listener: ScdoProviderEventsMap[E]): this;
    private _transformTx;
    request(props: ScdoRequestProps): Promise<string | void | string[] | {
        Data: {
            Type: number;
            From: string;
            To: string;
            Amount: number;
            AccountNonce: number;
            GasPrice: number;
            GasLimit: number;
            Timestamp: number;
            Payload: string;
        };
        Hash: string;
        Signature: {
            Sig: string;
        };
    }>;
}
export {};
