/**
 * Indicates an error while creating a package
 */
export class DimeSetupError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DimeSetupError";
    }
}

/**
 * Indicates an error while calling `Dime.mountPackages`.
 * 
 * @see `Dime.mountPackages`
 */
export class DimeMountingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DimeMountingError";
    }
}

/**
 * Indicates an error while injecting a value using `@Inject`
 * 
 * @see `Inject`
 */
export class DimeInjectionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DimeInjectionError";
    }
}
