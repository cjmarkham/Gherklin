# Gherklin

An ESM linter for Gherkin, inspired by [Gherkin Lint](https://github.com/gherkin-lint/gherkin-lint)

![Mocha Tests](https://github.com/cjmarkham/gherkin-lint/actions/workflows/tests.yml/badge.svg)
![Linting](https://github.com/cjmarkham/gherkin-lint/actions/workflows/linting.yml/badge.svg)

# Usage

```typescript
import { Runner } from 'gherklin'

const errors = await Runner(config, ruleConfig)
```

`config` is general configuration for the linter and supports the following values:

| Key                 | Type                    | Description                                              |
|---------------------|-------------------------|----------------------------------------------------------|
| directory           | `string`                | The directory that contains your feature files           |
| customRulesDir      | `string`                | A directory containing custom rules                      |
| rules               | `RuleConfiguration`     | Individual config for each rule                          |

RuleConfiguration supports the following values:

| Key                 | Type                    | Description                                              |
| allowedTags         | `Array<string>`         | A list of allowed tags                                   |
| indentation         | `NumericalKeywordValue` | The indentation for each Gherkin keyword                 |
| maxScenariosPerFile | `number`                | The maximum number of scenarios allowed per feature file |


# Testing

Tests use the [Mocha Test Framework](https://mochajs.org/) and live in the [tests](./tests) directory.

Tests can be ran with `npm test`.

If you are running tests via an IDE such as IntelliJ, you will need to set some Node options:

```shell
NODE_OPTIONS="--loader ts-node/esm --experimental-specifier-resolution=node --no-warnings"
```

More info as to why can be found on the [ts-node repository](https://github.com/TypeStrong/ts-node/issues/1007)
