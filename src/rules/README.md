# Rules

Rules can either be specified in your `gherklin.config.ts` file, or inline when you call
the [Runner](../../README.md#api)

Rule configuration takes the form of a `string` key and a value. Every rule supports `off` as a
value,
turning the rule off (which is the same as excluding it from the configuration).

However, depending on the rule, there may be more configuration values.

If a rule does not specify a severity, it will default to `warn`.

The following is a list of rules and whether or not they are fixable with the `fix` configuration
option.

| Name                                                    | Rule                        | Fixable |
|---------------------------------------------------------|-----------------------------|:-------:|
| [Allowed Tags](#allowed-tags)                           | `allowed-tags`              |    ❌    | 
| [Indentation](#indentation)                             | `indentation`               |    ✅    |
| [Max Scenarios](#max-scenarios)                         | `max-scenarios`             |    ❌    |
| [New Line at EOF](#new-line-at-eof)                     | `new-line-at-eof`           |    ✅    |
| [No Background Only](#no-background-only)               | `no-background-only`        |    ❌    |
| [No Dupe Features](#no-dupe-features)                   | `no-dupe-features`          |    ❌    |
| [No Dupe Scenarios](#no-dupe-scenarios)                 | `no-dupe-scenerios`         |    ❌    |
| [No Similar Scenarios](#no-similar-scenarios)           | `no-similar-scenerios`      |    ❌    |
| [No Empty File](#no-empty-file)                         | `no-empty-file`             |    ❌    |
| [No Trailing Spaces](#no-trailing-spaces)               | `no-trailing-spaces`        |    ✅    |
| [No Unnamed Scenarios](#no-unnamed-scenarios)           | `no-unnamed-scenarios`      |    ❌    |
| [Keywords in Logical Order](#keywords-in-logical-order) | `keywords-in-logical-order` |    ❌    |
| [No Single Example Outline](#no-single-example-outline) | `no-single-example-outline` |    ❌    |
| [No Full Stop](#no-full-stop)                           | `no-full-stop`              |    ✅    |
| [No Scenario Splat](#no-scenario-splat)                 | `no-scenario-splat`         |    ❌    |
| [No Typographer Quotes](#no-typographer-quotes)         | `no-typographer-quotes`     |    ✅    |
| [Background Setup Only](#background-setup-only)         | `background-setup-only`     |    ❌    |
| [Given After Background](#given-after-background)       | `given-after-backgroundy`   |    ❌    |
| [No Inconsistent Quotes](#no-inconsistent-quotes)       | `no-inconsistent-quotes`    |    ✅    |
| [Filename Snake Case](#filename-snake-case)             | `filename-snake-case`       |    ❌    |
| [Filename Kebab Case](#filename-kebab-case)             | `filename-kebab-case`       |    ❌    |
| [Unique Examples](#unique-examples)                     | `unique-examples`           |    ❌    |

### Allowed Tags

Restrict which tags are allowed in feature files by specifying a list. This rule
checks for valid tags at the feature level and scenario level.

**Examples**

Enable the rule with arguments

```typescript
export default {
  rules: {
    'allowed-tags': ['@development'],
  },
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'allowed-tags': ['error', '@development'],
  }
}
```

<hr>

### Indentation

Configure how many spaces are allowed for different Gherkin keywords.

**Examples**

Enable the rule with arguments

```typescript
export default {
  rules: {
    indentation: {
      feature: 1,
      background: 3,
      scenario: 3,
      step: 5,
      examples: 5,
      given: 5,
      when: 5,
      then: 5,
      and: 5,
      but: 5,
      exampleTableHeader: 7,
      exampleTableBody: 7,
    }
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    indentation: [
      'error',
      {
        feature: 1,
        background: 3,
        scenario: 3,
        step: 5,
        examples: 5,
        given: 5,
        when: 5,
        then: 5,
        and: 5,
        but: 5,
        exampleTableHeader: 7,
        exampleTableBody: 7,
      }
    ]
  }
}
```

<hr>

### Max Scenarios

Specify the maximum number of scenarios allowed per feature.

**Examples**

Enable the rule with arguments

```typescript
export default {
  rules: {
    'max-scenarios': 2,
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'max-scenarios': [
      'error',
      2,
    ]
  }
}
```

<hr>

### New Line at EOF

Expect a new line at the end of each file.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'new-line-at-eof': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'new-line-at-eof': 'error',
  }
}
```

<hr>

### No Background Only

Don't allow features which only have a background.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-background-only': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-background-only': 'error',
  }
}
```

<hr>

### No Dupe Features

Don't allow features to have the same name across all files.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-dupe-features': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-dupe-features': 'error',
  }
}
```

<hr>

### No Dupe Scenarios

Don't allow scenarios to have the same name across all files.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-dupe-scenarios': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-dupe-scenarios': 'error',
  }
}
```

<hr>

### No Empty File

Don't allow feature files to be empty.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-empty-file': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-empty-file': 'error',
  }
}
```

<hr>

### No Trailing Spaces

Don't allow trailing spaces at the end of lines.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-trailing-spaces': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-trailing-spaces': 'error',
  }
}
```

<hr>

### No Unnamed Scenarios

Expect every scenario to be named.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-unnamed-scenarios': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-unnamed-scenarios': 'error',
  }
}
```

### Keywords in Logical Order

Asserts that keywords follow the logical order or Given, When, Then.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'keywords-in-logical-order': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'keywords-in-logical-order': 'error',
  }
}
```

### No Similar Scenarios

Compares each scenario with each other scenario to see if they are similar.
Compares the Levenshtein distance between one scenarios keyword + text with the other scenarios
keyword + text.
The argument passed to this rule's configuration is the percentage threshold for similarity.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-similar-scenarios': 'on',
  }
}
```

Enable the rule with arguments

```typescript
export default {
  rules: {
    'no-similar-scenarios': 85,
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-similar-scenarios': 'error',
  }
}
```

Set severity and arguments

```typescript
export default {
  rules: {
    'no-similar-scenarios': ['error', 99],
  }
}
```

### No Single Example Outline

Checks Scenario Outlines that only have one example. These should be converted to simple Scenarios.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-single-example-outline': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-single-example-outline': 'error',
  }
}
```

### No Full Stop

Full stops (period) end sentences and don't convey a flow of steps.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-full-stops': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-full-stops': 'error',
  }
}
```

### No Scenario Splat

Splat steps (*) are useful for setup, which should occur in the background

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-scenario-splat': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-scenario-splat': 'error',
  }
}
```

### No Typographer Quotes

"Smart quotes" can be a result of copy/pasting from other programs and may not be intended.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-typographer-quotes': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-typographer-quotes': 'error',
  }
}
```

Enable the rule and set argument.

*The argument is used as a replacement when the `fix` option is specified.*

```typescript
export default {
  rules: {
    'no-typographer-quotes': ['error', "\""],
  }
}
```

### Background Setup Only

Background should be used for set up only, so should only include "Given" or splats (*).

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'background-setup-only': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'background-setup-only': 'error',
  }
}
```

### Given After Background

If you have a background, it should be used to set up scenarios, so there's no need for scenarios to
also use "Given"

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'given-after-background': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'given-after-background': 'error',
  }
}
```

### No Inconsistent Quotes

Prefer consistency with quotes used.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'no-inconsistent-quotes': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'no-inconsistent-quotes': 'error',
  }
}
```

Enable the rule and set argument.

*The argument is used as a replacement when the `fix` option is specified.*

```typescript
export default {
  rules: {
    'no-inconsistent-quotes': ['error', "\""],
  }
}
```

### Filename Snake Case

File names should be in snake_case.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'filename-snake-case': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'filename-snake-case': 'error',
  }
}
```

### Filename Kebab Case

File names should be in kebab-case.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'filename-kebab-case': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'filename-kebab-case': 'error',
  }
}
```

### Unique Examples

Examples should have a unique name if there are more than 1 in a scenario outline.

**Examples**

Enable the rule

```typescript
export default {
  rules: {
    'unique-examples': 'on',
  }
}
```

Enable the rule and set severity

```typescript
export default {
  rules: {
    'unique-examples': 'error',
  }
}
```
