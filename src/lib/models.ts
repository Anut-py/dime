import { DimeSetupError } from "./errors";
import { getTokenName, isClass, isProviderWithData } from "./internal";

/**
 * A utility interface to represent classes
 *
 * @example
 * class AClass {}
 * function NotAClass() {}
 *
 * const c: TypeRef<AClass> = AClass; // Works; 'AClass' is a class
 * const f: TypeRef<NotAClass> = NotAClass; // ERROR: NotAClass is not a class
 */
export interface TypeRef<T> extends Function {
    new (...args: unknown[]): T;
}

/**
 * A wrapper class for injection tokens. In most cases, you can just use a `ProviderToken` with a `string` value.
 *
 * @example
 * const LOG = new Token("log");
 * const appPackage = new Package("App", {
 *   token: LOG,
 *   provideClass: LoggerService
 * });
 *
 * @see {@link ProviderToken}
 */
export class Token {
    constructor(public readonly name: string) {}
}

/**
 * A type that represents all valid injection tokens.
 *
 * @example
 * const appPackage = new Package("App", {
 *   token: "hello", // strings are valid ProviderTokens
 *   provideValue: "world"
 * });
 *
 * @see {@link Token} and {@link TypeRef}
 */
export type ProviderToken = string | Token | TypeRef<unknown>;

/**
 * A provider must have a `token`, and one of the following:
 *  - `provideClass` will inject a singleton instance of the given class
 *  - `provideValue` will inject the value that is given
 *  - `provideFactory` has two possible inputs
 *     - If a function is passed to `provideFactory`, it will use the given function to create a new value every time it is injected
 *     - If a class is passed to `provideFactory`, it will create a new instance of the class wherever it is injected
 * In your code, use `Provider` instead.
 *
 * @see {@link Provider}
 */
export interface ProviderWithData {
    token: ProviderToken;
    provideClass?: TypeRef<unknown>;
    provideValue?: unknown;
    provideFactory?: (() => unknown) | TypeRef<unknown>;
}

/**
 * Almost the same as `ProviderWithData`. The only difference is that you can pass a `TypeRef` as a `Provider`.
 *
 * @example
 * const provider: Provider = AClass;
 * // is equivalent to
 * const provider: Provider = {
 *   token: AClass,
 *   provideClass: AClass
 * };
 *
 * @see {@link TypeRef} and {@link ProviderWithData}
 */
export type Provider = TypeRef<unknown> | ProviderWithData;

/**
 * Packages are a way to wrap multiple providers into one object.
 */
export class Package {
    __providers: ReadonlyArray<ProviderWithData>;

    /**
     * Wraps the given providers into a package
     * @param name The name of the package. A unique name will help when tracing errors.
     * @param providers The providers to wrap. You can also give `Package`s as parameters;
     * in that case, it will take all the providers from that package and include them in this package.
     *
     * If there are multiple providers with the same token, the package will include only the first one
     * it encounters. All others will be ignored.
     */
    constructor(
        public readonly name: string,
        ...providers: (Provider | Package)[]
    ) {
        const allProviders: ProviderWithData[] = [];
        for (let provider of providers) {
            if (!provider) {
                throw new DimeSetupError(
                    "Error while setting up package `" +
                        name +
                        "`: Expected provider or package but got " +
                        provider
                );
            } else if (provider instanceof Package) {
                provider.__providers.forEach((x) =>
                    this.addProvider(x, allProviders)
                );
            } else this.addProvider(provider, allProviders);
        }
        this.__providers = allProviders;
    }

    private addProvider(provider: Provider, allProviders: ProviderWithData[]) {
        if (isClass(provider)) {
            if (
                !allProviders.find(
                    (x) => getTokenName(x.token) == getTokenName(provider)
                )
            ) {
                allProviders.push({
                    token: provider,
                    provideClass: provider,
                });
            }
        } else if (isProviderWithData(provider)) {
            if (provider.provideFactory && isClass(provider.provideFactory)) {
                let factory = provider.provideFactory;
                if (
                    isClass(factory) &&
                    !allProviders.find(
                        (x) =>
                            getTokenName(x.token) ===
                            getTokenName(provider.token)
                    )
                ) {
                    allProviders.push({
                        token: provider.token,
                        provideFactory: () => new factory(),
                    });
                }
            } else if (
                !allProviders.find(
                    (x) =>
                        getTokenName(x.token) === getTokenName(provider.token)
                )
            ) {
                allProviders.push(provider);
            }
        } else {
            throw new DimeSetupError(
                "Error while setting up package `" +
                    this.name +
                    "`: Could not parse provider " +
                    provider
            );
        }
    }
}

/**
 * A simple class for broadcasting events
 */
export class Event {
    private subscribers: Function[];
    private emitted: boolean;

    constructor() {
        this.subscribers = [];
        this.emitted = false;
    }

    /**
     * Adds a subscriber to this event
     * @param subscriber The subscriber function; called when the event occurs, or immediately if it has already occured.
     */
    subscribe(subscriber: Function) {
        if (!this.emitted) this.subscribers.push(subscriber);
        else subscriber();
    }

    /**
     * Emits the event and calls all the subscriber functions
     */
    emit() {
        this.emitted = true;
        this.subscribers.forEach((x) => x());
    }
}
