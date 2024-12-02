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
        <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg">
    </a>
    <a href="https://www.npmjs.com/package/gherklin">
        <img alt="npm version" src="https://img.shields.io/npm/v/gherklin.svg">
    </a>
    <a href="https://github.com/cjmarkham/Gherklin/actions/workflows/github-code-scanning/codeql">
      <img src="https://github.com/cjmarkham/Gherklin/actions/workflows/github-code-scanning/codeql/badge.svg">
    </a>
    <a href="https://github.com/cjmarkham/Gherklin">
      <img src="https://img.shields.io/badge/code_style-gherklin-5B21B6.svg">
    </a>
  </p>
  <p align="left">
    A modern and extensible linter for Gherkin syntax, supporting custom rules, automatic fixing et al. Powered by TypeScript and ESM.
  </p>
</div>

# Contents
* [Installation](#installation)
* [Usage](#usage)
* [Configuration](#configuration)
* [Disabling Rules](#disabling-rules)
* [Automatic Fixing](#automatic-fixing)
* [Custom Rules](#custom-rules)
  * [Generating Custom Rules](#generating-custom-rules)
* [Reporting](#reporting)
  * [Reporter Configuration](#reporter-configuration)
* [Contributing](#contributing)
* [Testing](#testing)

# Installation
Gherklin can be installed either via NPM or Yarn
```shell
npm install gherklin
```
```shell
yarn add gherklin
```

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

Gherklin will look for a `gherklin.config.ts` file in the same directory as your `package.json`
file.

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

| Parameter                     | Type     | Description                                       |
|-------------------------------|----------|---------------------------------------------------|
| `featureDirectory` (required) | `string` | The folder where your Gherkin features are        |
| `customRulesDirectory`        | `string` | The directory where your custom rules are         |
| `rules`                       | `object` | Configuration per rule                            |
| `maxErrors`                   | `number` | Maximum amount of errors before the process fails |

`rules` contains the configuration for each rule, whether built in or custom.
Check [rules](./src/rules/README.md) for a list of built in rules.

# Disabling Rules

Gherklin rules can be disabled on a per line or per file basis.

Adding `gherklin-disable` at the top of a file in a comment will disable Gherklin rules for that
file.

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

While `gherklin-disable` works for every rule, `gherklin-disable-next-line` only works for rules
where it makes sense.
For example, using `gherklin-disable-next-line` does not make sense for the `no-empty-file` rule.

You can also disable specific rules for the file, using the # gherklin-disable rule-name.

### Example
```gherkin
# gherklin-disable allowed-tags, no-unnamed-scenario
Feature: The below tag is invalid
  @invalid-tag
  Scenario:
```

# Automatic Fixing

Gherklin supports automatic fixing for a small set of rules, usually those to do with whitespace.

To allow Gherklin to automatically fix rules that can be fixed, pass the `fix` option to your `gherklin.config.ts` file:

### Example
```typescript
export default {
  ...
  fix: true,
}
```

Gherklin fixes files **before** the rules are ran against the file. This is so you can be sure that the fix actually worked.

### Custom Rule Fixing

In order to support custom rule fixes, your rule class needs to have a `fix` method.

This method takes the [Document](./src/document.ts) as a parameter.

This method **must** call `document.regenerate()` to save the document.

An example can be found with the [no-trailing-spaces](./src/rules/no-trailing-spaces.ts) rule.

# Custom Rules

Custom rules can be loaded by setting the `customRulesDirectory` parameter in your config file.

There are a few things needed to consider for rules:

- Each file in the directory contains one rule.
- Each file exports a default class that implements [Rule](./src/rule.ts)

Schema for rules uses [Zod](https://github.com/colinhacks/zod). There are a few different schemas
specified in [the schemas file](./src/schemas.ts), but if you
want to create something different, you can use Zod directly.
When the rule is loaded, this schema is used to verify the configuration value for the rule.

## Generating Custom Rules
Gherklin comes with a generator script that you can use. Running the following will generate the skeleton for a new Rule class:
```shell
npx tsx ./node_modules/.bin/gherklin-rule
```

# Reporting

By default, Gherklin outputs to STDOUT. You can change this by specifying the reporter in your
`gherklin.config.ts` file or inline configuration. If no reporter is specified, the STDOUT Reporter will be used.

Currently, the available reporters are STDOUT, HTML and JSON.

## Reporter Configuration

| key     | description                               |
|---------|-------------------------------------------|
| type    | The type of reporter (html, json, stdout) |
| outFile | The file the report is written to         | 

# Contributing

If you are adding new rules, they must follow the same format as existing rules (
see [Custom Rules](#custom-rules)).
Each new rule must have acceptance tests (see [testing](#testing)) and be added to
the [Rules README](./src/rules/README.md).

# Testing

Tests use the [Mocha Test Framework](https://mochajs.org/) and live in the [tests](./tests)
directory.

Tests can be ran with `npm test`.
