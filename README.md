# Gherklin

An ESM linter for Gherkin, inspired by [Gherkin Lint](https://github.com/gherkin-lint/gherkin-lint)

![Mocha Tests](https://github.com/cjmarkham/gherkin-lint/actions/workflows/tests.yml/badge.svg)
![Linting](https://github.com/cjmarkham/gherkin-lint/actions/workflows/linting.yml/badge.svg)

# Usage

```shell
npx tsx gherklin
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

`rules` contains the configuration for each rule, whether built in or custom. Check [rules](./src/rules) for a list of built in rules.

# Testing

Tests use the [Mocha Test Framework](https://mochajs.org/) and live in the [tests](./tests) directory.

Tests can be ran with `npm test`.

If you are running tests via an IDE such as IntelliJ, you will need to set some Node options:

```shell
NODE_OPTIONS="--loader ts-node/esm --experimental-specifier-resolution=node --no-warnings"
```

More info as to why can be found on the [ts-node repository](https://github.com/TypeStrong/ts-node/issues/1007)
