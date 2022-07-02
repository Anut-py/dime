import { DimeMountingError } from "./errors";
import { __done, getTokenName, __deps, KeyMap } from "./internal";
import { Package, ProviderToken } from "./models";

/**
 * An interface that allows you to access registered Dime objects
 */
export interface Injector {
    /**
     * Get the provider registered with a token
     * @param token The token to search with
     * @returns The matching provider, or `null` if no provider was found
     */
    get<T>(token: ProviderToken): T;

    /**
     * Takes a token and looks for a registered token with the same name.
     * You probably won't need to use this.
     * @param token The input token (not necessarily valid)
     * @returns A registered token with the same name as the input
     */
    getValidToken(token: ProviderToken): ProviderToken | undefined;
}

class MapBasedInjector implements Injector {
    constructor(private providerMap: KeyMap) {}

    get<T>(token: ProviderToken): T {
        const key = this.getValidToken(token);
        if (!key) return key as any;
        return this.providerMap.get(key);
    }

    getValidToken(token: ProviderToken): ProviderToken | undefined {
        return this.providerMap
            .keys()
            .find(
                (x) =>
                    this.uppercaseFirstLetter(getTokenName(x)) ===
                    this.uppercaseFirstLetter(getTokenName(token))
            );
    }

    private uppercaseFirstLetter(str: string) {
        let upper = str[0].toUpperCase();
        for (let i = 1; i < str.length; i++) {
            upper += str[i];
        }
        return upper;
    }
}

/**
 * This namespace includes important functions and objects required for using Dime
 */
export namespace Dime {
    /**
     * Sets up Dime and configures the given providers
     * @param packages The packages to mount
     */
    export function mountPackages(...packages: Package[]) {
        const bundle = new Package("Dime", ...packages);
        for (let injectable of bundle.__providers) {
            if (!injectable.token) {
                throw new DimeMountingError("Received provider with no token!");
            } else {
                const tokenName = getTokenName(injectable.token);
                const matching = __deps
                    .keys()
                    .find((x) => getTokenName(x) === tokenName);
                if (matching) {
                    throw new DimeMountingError("Error");
                } else if (injectable.provideClass) {
                    __deps.set(injectable.token, new injectable.provideClass());
                } else if (injectable.provideValue) {
                    __deps.set(injectable.token, injectable.provideValue);
                } else if (injectable.provideFactory) {
                    __deps.set(injectable.token, injectable.provideFactory);
                } else {
                    throw new DimeMountingError(
                        "Received provider `" +
                            getTokenName(injectable.token) +
                            "` with no value!"
                    );
                }
            }
        }
        __done.next(true);
    }

    /**
     * The global injector; used for injecting any providers set up by Dime
     */
    export const injector: Injector = new MapBasedInjector(__deps);
}
