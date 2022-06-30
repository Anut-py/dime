import { BehaviorSubject } from "rxjs";
import { Token, TypeRef } from "./models";

class KeyMap {
    private _vals = new Map<Token | TypeRef<any>, any>();
    private _keys: (Token | TypeRef<any>)[] = [];

    get(key: Token | TypeRef<any>) {
        return this._vals.get(key);
    }

    set(key: Token | TypeRef<any>, value: any) {
        if (!this._keys.includes(key)) this._keys.push(key);
        this._vals.set(key, value);
    }

    has(key: Token | TypeRef<any>) {
        return this._vals.has(key);
    }

    keys() {
        return this._keys;
    }
}

export const __deps = new KeyMap();
export const __done = new BehaviorSubject(false);
export function getTokenName(token: TypeRef<any> | Token) {
    if (token instanceof Token) return token.description;
    else return token.name;
}