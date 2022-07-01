import { BehaviorSubject } from "rxjs";
import { ProviderToken, Token, TypeRef } from "./models";

export class KeyMap {
    private _vals = new Map<ProviderToken, any>();
    private _keys: ProviderToken[] = [];

    get(key: ProviderToken) {
        const value = this._vals.get(key);
        if (typeof value === "function") {
            return value();
        }
        return value;
    }

    set(key: ProviderToken, value: any) {
        if (!this._keys.includes(key)) this._keys.push(key);
        this._vals.set(key, value);
    }

    has(key: ProviderToken) {
        return this._vals.has(key);
    }

    keys() {
        return this._keys;
    }
}

export const __deps = new KeyMap();
export const __done = new BehaviorSubject(false);
export function getTokenName(token: ProviderToken) {
    if (typeof token === "string") return token;
    else if (token instanceof Token) return token.description;
    else return token.name;
}
export function isClass(func: any) {
    return typeof func === "function" && /^class\s/.test(Function.prototype.toString.call(func));
}