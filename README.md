# Gherkin Linter
An ESM linter for Gherkin, inspired by [Gherkin Lint](https://github.com/gherkin-lint/gherkin-lint)

![Mocha Tests](https://github.com/cjmarkham/gherkin-lint/actions/workflows/tests.yml/badge.svg)
![Linting](https://github.com/cjmarkham/gherkin-lint/actions/workflows/linting.yml/badge.svg)

# Usage
```typescript
import GherkinLinter from 'gherkin-linter'

const errors = await GherkinLinter(config, ruleConfig)
```

`config` is general configuration for the linter and supports the following values:

| Key            | Type   | Description                                    |
|----------------|--------|------------------------------------------------|
| directory      | string | The directory that contains your feature files |
| customRulesDir | string | A directory containing custom rules            |

`ruleConfig` is configuration for specific rules. It supports the following values:

| Key                 | Type   | Description                                              |
|---------------------|--------|----------------------------------------------------------|
| maxScenariosPerFile | number | The maximum number of scenarios allowed per feature file |

# Custom Rules
The linter supports the loading of custom rules. By specifying a `customRulesDir`, it will load each
TypeScript file in that directory and use them as lint validation. See the [built in rules](./rules) for examples.

Each rule **must** export a default function. These functions are passed a few arguments:

| Argument   | Type            | Description                       |
|------------|-----------------|-----------------------------------|
| ruleConfig | RuleConfig      | The configuration for rules       |
| document   | GherkinDocument | The Gherkin Document              |
| fileName   | string          | The name of the file being linted |

Each rule **must** return an array of LintError or an empty array if no errors.  

# Testing

Tests use the [Mocha Test Framework](https://mochajs.org/) and live in the [tests](./tests) directory.

Tests can be ran with `npm test`. 

If you are running tests via an IDE such as IntelliJ, you will need to set some Node options:

```shell
NODE_OPTIONS="--loader ts-node/esm --experimental-specifier-resolution=node --no-warnings"
```

More info as to why can be found on the [ts-node repository](https://github.com/TypeStrong/ts-node/issues/1007)
