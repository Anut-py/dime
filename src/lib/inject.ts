import { Dime } from "./dime";
import { DimeInjectionError } from "./errors";
import { getTokenName, __done } from "./internal";
import { ProviderToken } from "./models";

/**
 * A decorator that injects a provider into a class's property.
 *
 * @param type Optional, specifies the token to inject. If this is
 * omitted, the property name will be used as the token.
 *
 * @example
 * class Example {
 *   ＠Inject()
 *   someService: SomeService; // Injects `SomeService`
 * }
 *
 * console.log(new Example().someService.getItems());
 */
export function Inject(type?: ProviderToken) {
    return function (target: unknown, propertyKey: string): void {
        const timeout = setTimeout(() => {
            console.warn(
                "WARNING: You have used @Inject but no Dime setup was detected in " +
                    Dime.settings.INJECT_TIMEOUT +
                    "ms.\n" +
                    "Did you forget to call `Dime.configure` in your code?\n" +
                    "If not, your app is probably taking too long to load. " +
                    "In that case, you can ignore this message.\nIf you are not running " +
                    "this in a browser, you can set the `DIME_INJECT_TIMEOUT` environment variable " +
                    "to a higher value (in milliseconds)."
            );
        }, Dime.settings.INJECT_TIMEOUT);
        __done.subscribe(() => {
            clearTimeout(timeout);
            const token = Dime.injector.getValidToken(type ?? propertyKey);
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
                        valMap.set(this, Dime.injector.get(token));
                    return valMap.get(this);
                },
                set: function (val: unknown) {
                    valMap.set(this, val);
                },
            });
        });
    };
}
