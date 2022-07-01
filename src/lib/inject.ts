import { filter } from "rxjs";
import { Dime } from "./dime";
import { DimeInjectionError } from "./errors";
import { getTokenName, __deps, __done } from "./internal";
import { ProviderToken } from "./models";

export function Inject(type?: ProviderToken) {
    return function (target: any, propertyKey: string): void {
        __done.pipe(filter((x) => !!x)).subscribe(() => {
            const token = Dime.injector.getValidToken(type || propertyKey);
            if (!token) {
                if (type) {
                    throw new DimeInjectionError(
                        "Cannot find injectable value for token `" +
                            getTokenName(type) +
                            "`! Did you forget to include `" +
                            getTokenName(type) +
                            "` in a package?"
                    );
                } else {
                    throw new DimeInjectionError(
                        "Cannot find injection token for key `" +
                            propertyKey.toString() +
                            "`!\n\nPossible causes:\n - You forgot to pass a token to @Inject()\n - You forgot to include `" +
                            propertyKey +
                            "` in a package\n - You misspelled the field name `" +
                            propertyKey +
                            "`\n"
                    );
                }
            }
            const valMap = new Map();
            Object.defineProperty(target, propertyKey, {
                get: function () {
                    if (!valMap.has(this))
                        valMap.set(this, Dime.injector.get(token as ProviderToken));
                    return valMap.get(this);
                },
                set: function (val: any) {
                    valMap.set(this, val);
                },
            });
        });
    };
}
