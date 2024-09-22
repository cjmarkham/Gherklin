# Contributing to Gherklin

To get started contributing to Gherklin, you can install the dependencies and run the tests.
```shell
npm install
npm test
```

# Rules
Rules are located in the [rules directory](./src/rules).

Every rule must have 2 named exports:
* `schema`: This is the schema the rule follows
* `run`: This is the main entrypoint for the rule

The `run` function accepts 2 - 3 arguments, with `fileName` being optional:
* `rule: Rule`: The rule being evaluated
* `document: GherkinDocument`: The Gherkin document being validated
* `fileName: string`: The name of the file being validated

Rules can be `sync` or `async`.

# Tests
Tests are written using [Mocha](https://mochajs.org/), with [Sinon](https://sinonjs.org/) for some mocking.

Each new rule must have acceptance tests.

# Pull Requests
Gherklin uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code formatting. It may be useful
to set up your IDE to automatically format on save. 

You can also run the following if that is not an option:
```shell
npm run eslint:fix
npm run prettier:fix
```

Please be as descriptive as possible in your PR description, mentioning any issue(s) that are resolved by your PR.
