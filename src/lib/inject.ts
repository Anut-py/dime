import { filter } from "rxjs";
import { DimeInjectionError } from "./errors";
import { __done, getTokenName, __deps } from "./internal";
import { Token, TypeRef } from "./models";

export function Inject(type?: Token | TypeRef<any>) {
    return function (target: any, propertyKey: string): void {
        __done.pipe(filter((x) => !!x)).subscribe(() => {
            if (!type) {
                const keyName = propertyKey;
                let tokenName = keyName[0].toUpperCase();
                for (let i = 1; i < keyName.length; i++) {
                    tokenName += keyName[i];
                }
                for (let key of __deps.keys()) {
                    if (
                        getTokenName(key) === tokenName ||
                        getTokenName(key) === propertyKey
                    ) {
                        type = key;
                    }
                }
                if (!type) {
                    throw new DimeInjectionError(
                        "Cannot find injection token for key `" +
                            propertyKey.toString() +
                            "`!\n\nPossible causes:\n - You forgot to pass a token to @Inject()\n - You forgot to include `" +
                            tokenName +
                            "` in a package\n - You misspelled the field name `" +
                            propertyKey +
                            "`\n"
                    );
                }
            }
            Object.defineProperty(target, propertyKey, {
                value: __deps.get(type),
            });
        });
    };
}
