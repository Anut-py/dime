export class DimeSetupError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DimeSetupError";
    }
}

export class DimeMountingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DimeMountingError";
    }
}

export class DimeInjectionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DimeInjectionError";
    }
}
