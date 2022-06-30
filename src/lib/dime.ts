import { DimeMountingError } from "./errors";
import { __done, getTokenName, __deps } from "./internal";
import { Package } from "./models";

export namespace Dime {
    export function mountPackages(...packages: Package[]) {
        const bundle = new Package("Dime", ...packages);
        for (let injectable of bundle.__providers) {
            if (!injectable.token) {
                throw new DimeMountingError(
                    "Received provider with no token!"
                );
            } else {
                const tokenName = getTokenName(injectable.token);
                const matching = __deps.keys().find(x => getTokenName(x) === tokenName);
                if (matching) {
                    throw new DimeMountingError("Error")
                } else if (injectable.provideClass) {
                    __deps.set(injectable.token, new injectable.provideClass());
                } else if (injectable.provideValue) {
                    __deps.set(injectable.token, injectable.provideValue);
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
