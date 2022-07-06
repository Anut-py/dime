# DIME:  Dependency injection made easy
[![quality gate](https://sonarcloud.io/api/project_badges/measure?project=coined_dime&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=coined_dime)
[![coverage](https://img.shields.io/sonar/coverage/coined_dime/master?server=https%3A%2F%2Fsonarcloud.io)](https://sonarcloud.io/component_measures?id=coined_dime&metric=coverage&view=list)
[![build](https://github.com/Anut-py/dime/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/Anut-py/dime/actions/workflows/build.yml)
[![npm](https://img.shields.io/npm/v/@coined/dime)](https://www.npmjs.com/package/@coined/dime)

Dime is an extremely simple API that has one job: dependency injection.

## What is dependency injection?
Dependency injection is a way to *decouple* the pieces of your code; that is, separate the definition and implementation of your code.

## Why should you use dependency injection?
Here's an example of an `ItemsWidget` which receives its data from `AmazonItemsService`.
```ts
// Without Dime 👎
import { AmazonItemsService } from './amazon-items-service';

class ItemsWidget {
    constructor(private itemsService: AmazonItemsService) {}

    render() {
        this.itemsService.getItems().subscribe(items => {
            // ...
        })
    }
}

// Display the widget
const widget = new ItemsWidget(new AmazonItemsService());
widget.render();
```

This looks fine at first glance, but what if at some point you decided to get your items from eBay instead of Amazon? Then you would have to replace `AmazonItemsService` with `EbayItemsService`. This isn't a big deal in the simple example above, but if `ItemsWidget` was used in several places throughout the code, this would be more difficult. As a project gets larger, it becomes impossible to maintain a codebase like this, and that's where Dime comes in.

```ts
// With Dime 👍
import { ItemsService } from './items-service';
import { Inject } from '@coined/dime';

class ItemsWidget {
    @Inject()
    private itemsService: ItemsService;

    render() {
        this.itemsService.getItems().subscribe(items => {
            // ...
        })
    }
}

// Setup
const appPackage = new Package("App", {
    token: "itemsService",
    provideClass: AmazonItemsService // Use Amazon implementation
});

Dime.configure().withPackages(appPackage).lazy().load();

// Display the widget
const widget = new ItemsWidget();
widget.render();
```

In this version of the code, `ItemsService` is an interface. Using Dime allows you to abstract away the implementation details of `ItemsService`. Here, if you wanted to use `EbayItemsService` instead, you would only need to change the code in one place, no matter how many times you used `ItemsWidget`.

## Documentation and reference
Additional information is on the [website](dime.js.org).

## Contributors
Please refer to [CONTRIBUTING.md](https://github.com/Anut-py/dime/blob/master/CONTRIBUTING.md) for instructions on how to contribute.
