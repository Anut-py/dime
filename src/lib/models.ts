import { DimeSetupError } from "./errors";
import { getTokenName } from "./internal";

export interface TypeRef<T> extends Function {
    new (...args: any[]): T;
}

export class Token {
    constructor(public readonly description: string) {}
}

export type ProviderToken = string | Token | TypeRef<any>;

export interface ProviderWithData {
    token: ProviderToken;
    provideClass?: TypeRef<any>;
    provideValue?: any;
}

export type Provider = TypeRef<any> | ProviderWithData;

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export class Package {
    __providers: ReadonlyArray<ProviderWithData>;

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
        if ((provider as TypeRef<any>).prototype?.constructor) {
            if (!allProviders.find((x: any) => x.token == provider)) {
                allProviders.push({
                    token: provider as TypeRef<any>,
                    provideClass: provider as TypeRef<any>,
                });
            }
        } else if ((provider as ProviderWithData).token) {
            if (
                !allProviders.find(
                    (x: any) => getTokenName(x.token) === getTokenName((provider as ProviderWithData).token)
                )
            ) {
                allProviders.push(provider as ProviderWithData);
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
