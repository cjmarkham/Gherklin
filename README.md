<h1 class="user-content-gherklin" align="center">Gherklin</h1>
<div align="right">
  <img align="left" src=".github/gherkie.png" alt="Gherkie" width="120" height="120">
  
  <p align="left">
      <em>Always clean your Gherkin!</em>
  </p>
  
  <p align="left">
    <a href="https://github.com/cjmarkham/Gherklin/actions/workflows/tests.yml">
        <img src="https://github.com/cjmarkham/gherkin-lint/actions/workflows/tests.yml/badge.svg">
    </a>
    <a href="https://github.com/cjmarkham/Gherklin/actions/workflows/linting.yml">
        <img src="https://github.com/cjmarkham/gherkin-lint/actions/workflows/linting.yml/badge.svg">
    </a>
    <a href="https://github.com/prettier/prettier/tree/c067d27673c6d97d9037eb9b13b74bd8c9324be2?tab=readme-ov-file#badge">
        <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier">
    </a>
    <a href="https://www.npmjs.com/package/gherklin">
        <img alt="npm version" src="https://img.shields.io/npm/v/gherklin.svg">
    </a>
  </p>
  <p align="left">
    Use Gherklin. The number 1 brand of Gherkin cleaner, recommended by Gherkin washers everywhere.
  </p>
</div>


# Usage

#### Bin script
Gherklin includes a bin file, which can be ran with the following
```shell
npx tsx ./node_modules/.bin/gherklin
```

#### API
Gherklin also has an API that can be invoked. A simple example of which is:
```typescript
import { Runner } from 'gherklin'

;(async () => {
  const runner = new Runner()
  const init = await runner.init()
  if (!init.success) {
    throw init.schemaErrors
  }
  const result = await runner.run()
  if (!result.success) {
    process.exit(1)
  }
  process.exit(0)
})()
```

# Configuration

Gherklin will look for a `gherklin.config.ts` file in the same directory as your `package.json` file.

This file should default export an object, which contains the parameters for Gherklin.

### Example
```typescript
export default {
  featureDirectory: './features',
  customRulesDirectory: './custom-rules',
  rules: {
    'allowed-tags': 'off',
  },
}
```

| Parameter                     | Type     | Description                                |
|-------------------------------|----------|--------------------------------------------|
| `featureDirectory` (required) | `string` | The folder where your Gherkin features are |
| `customRulesDirectory`        | string   | The directory where your custom rules are  |
| `rules`                       | `object` | Configuration per rule                     |

`rules` contains the configuration for each rule, whether built in or custom. Check [rules](./src/rules/README.md) for a list of built in rules.

# Disabling Rules

Gherklin rules can be disabled on a per line or per file basis.

Adding `gherklin-disable` at the top of a file in a comment will disable Gherklin rules for that file.

### Example
```gherkin
# gherklin-disable
Feature: All disabled
  Scenario: Nothing here will be linted
```

Adding `gherklin-disable-next-line` will disable Gherklin for the next line.

### Example
```gherkin
Feature: The below tag is invalid
  # gherklin-disable-next-line
  @invalid-tag
  Scenario: The above tag is invalid
```

While `gherklin-disable` works for every rule, `gherklin-disable-next-line` only works for rules where it makes sense.
For example, using `gherklin-disable-next-line` does not make sense for the `no-empty-file` rule.

# Automatic Fixing
**Gherklin** doesn't support automatic fixes that you may be used to with things like ESLint and Prettier.

Why? It's not so simple to fix Gherkin. 
Let's say we have a rule for allowed tags and you have a feature file with a tag that's not allowed. Gherklin
**could** remove this tag, but then that could break the semantic coupling between Gherkin and your step definitions.

Let's take another example, max scenarios. If **Gherklin** finds that a file has too many scenarios, should it delete the whole scenario?

These are a few of the reasons why **Gherklin** doesn't support automatic fix ups.

# Custom Rules
Custom rules can be loaded by setting the `customRulesDirectory` parameter in your config file.

There are a few things needed to consider for rules:
- Each file in the directory contains one rule.
- Each file has at minimum two exports
  - A named constant called schema 
  - A named function called `run`
  
Schema for rules uses [Zod](https://github.com/colinhacks/zod). There are a few different schemas specified in [the schemas file](./src/schemas.ts), but if you
want to create something different, you can use Zod directly.
When the rule is loaded, this schema is used to verify the configuration value for the rule.

The `run` function accepts two arguments
- rule: An instance of the [rule class](./src/rule.ts)
- document: The [Gherkin Document](https://github.com/cucumber/messages/blob/main/javascript/src/messages.ts#L94) being validated

The `run` function must return an array of [LintError](./src/error.ts) (or an empty array for no errors).

# Reporting

By default, Gherklin outputs to STDOUT. You can change this by specifying the reporter in your `gherklin.config.ts` file or inline configuration.

Currently, only the HTML and STDOUT reporter are available.

# Contributing

If you are adding new rules, they must follow the same format as existing rules (see [Custom Rules](#custom-rules)).
Each new rule must have acceptance tests (see [testing](#testing)) and be added to the [Rules README](./src/rules/README.md).

# Testing

Tests use the [Mocha Test Framework](https://mochajs.org/) and live in the [tests](./tests) directory.

Tests can be ran with `npm test`.
