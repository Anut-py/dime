import { Dime } from "./dime";
import { Package, Token } from "./models";

test('configuring works properly', () => {
    const testPackage = new Package("Test", {
        token: new Token("someValue"),
        provideValue: {
            test: true,
            hello: "world"
        }
    });

    Dime.configure().withPackages(testPackage).lazy().load();

    const value = Dime.injector.get("someValue");

    expect(value).toBeTruthy();
    expect(value.test).toBe(true);
    expect(value.hello).toBe("world");
});