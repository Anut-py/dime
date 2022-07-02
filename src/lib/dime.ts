import { DimeMountingError } from "./errors";
import { __done, getTokenName, __deps, KeyMap } from "./internal";
import { Package, Provider, ProviderToken } from "./models";

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

/**
 * A builder-type interface to set up Dime
 */
export interface DimeSetupBuilder {
    /**
     * Marks the specified packages to be mounted
     * @param packages The packages to add
     */
    withPackages(...packages: Package[]): DimeSetupBuilder;

    /**
     * Configures the module for lazy loading
     */
    lazy(): DimeSetupLoader;
}

/**
 * An interface to mount the Dime module with the provided setup.
 * You can get a reference to this through the `lazy` method of
 * `DimeSetupBuilder`
 * 
 * @see {@link DimeSetupBuilder}
 */
export interface DimeSetupLoader {
    /**
     * Mounts the module
     */
    load(): void;
}

class LazyDimeSetupLoader implements DimeSetupLoader {
    constructor(private packages: Package[]) {}

    load(): void {
        const bundle = new Package("Dime", ...this.packages);
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
}

class DefaultDimeSetupBuilder implements DimeSetupBuilder {
    private packages: Package[];

    constructor() {
        this.packages = [];
    }
    
    withPackages(...packages: Package[]): DimeSetupBuilder {
        this.packages.push(...packages);
        return this;
    }

    lazy(): DimeSetupLoader {
        return new LazyDimeSetupLoader(this.packages);
    }
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
 * 
 * For more detailed documentation, go to {@link https://github.com/Anut-py/dime/wiki}
 */
export namespace Dime {
    /**
     * Starts configuration of Dime
     * 
     * @returns A `DimeSetupBuilder` for setup of the module
     * 
     * @see {@link DimeSetupBuilder}
     */
    export function configure() {
        return new DefaultDimeSetupBuilder();
    }

    /**
     * The global injector; used for injecting any providers set up by Dime
     */
    export const injector: Injector = new MapBasedInjector(__deps);
}
