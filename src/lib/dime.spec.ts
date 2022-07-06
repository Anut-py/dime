import { Dime } from "./dime";
import { __deps } from "./internal";
import { Package, Token } from "./models";

describe("Setup", () => {
    it("should work with provideValue", () => {
        const testPackage = new Package("Test", {
            token: new Token("someValue"),
            provideValue: {
                test: true,
                hello: "world",
            },
        });

        Dime.configure().withPackages(testPackage).lazy().load();

        const value = Dime.injector.get("someValue");

        expect(value).toBeTruthy();
        expect(value.test).toBe(true);
        expect(value.hello).toBe("world");
    });

    it("should work with provideClass", () => {
        class ExampleClass {
            hello = "world";

            test() {
                return "example class return value";
            }
        }

        let testPackage = new Package("Test", ExampleClass);

        Dime.configure().withPackages(testPackage).lazy().load();

        const value = Dime.injector.get<ExampleClass>("ExampleClass");
        const value1 = Dime.injector.get<ExampleClass>("exampleClass");

        expect(value).toBeTruthy();
        expect(value).toBe(value1);
        expect(value.test()).toBe("example class return value");
        expect(value.hello).toBe("world");

        Dime.tearDown();

        testPackage = new Package("Test", {
            token: "testToken",
            provideClass: ExampleClass,
        });

        Dime.configure().withPackages(testPackage).lazy().load();

        const value2 = Dime.injector.get<ExampleClass>("testToken");

        expect(value2).toBeTruthy();
        expect(value2.hello).toBe("world");
        expect(value2.test()).toBe("example class return value");
    });

    it("should work with provideFactory", () => {
        let num = 1;
        const factory = () => {
            return { test: "value", number: num++ };
        };

        let testPackage = new Package("Test", {
            token: "testVal",
            provideFactory: factory
        });

        Dime.configure().withPackages(testPackage).lazy().load();

        const val1 = Dime.injector.get("testVal");
        const val2 = Dime.injector.get("testVal");

        expect(val1).toBeTruthy();
        expect(val2).toBeTruthy();
        expect(val1).not.toEqual(val2);
        expect(val1.number).toBe(1);
        expect(val1.test).toBe("value");
        expect(val2.number).toBe(2);
        expect(val2.test).toBe("value");

        Dime.tearDown();

        class SomeClass {
            num = 1;

            incrementNum() {
                this.num++;
            }
        }

        testPackage = new Package("Test", {
            token: SomeClass,
            provideFactory: SomeClass
        });

        Dime.configure().withPackages(testPackage).lazy().load();

        const val3 = Dime.injector.get(SomeClass);
        const val4 = Dime.injector.get(SomeClass);

        expect(val3).toBeTruthy();
        expect(val3).not.toBe(val4);
        val3.incrementNum();
        expect(val3.num).not.toBe(val4.num);
    });

    afterEach(() => Dime.tearDown());
});
