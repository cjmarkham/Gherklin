# Rules

Rules can either be specified in your `gherklin.config.ts` file, or inline when you call
the [Runner](../../README.md#api)

Rule configuration takes the form of a `string` key and a value. Every rule supports `off` as a value,
turning the rule off (which is the same as excluding it from the configuration).

However, depending on the rule, there may be more configuration values.

If a rule does not specify a severity, it will default to `warn`.

* [allowed-tags](#allowed-tags)
* [indentation](#indentation)
* [max-scenarios](#max-scenarios)
* [new-line-at-eof](#new-line-at-end-of-file)
* [no-background-only](#no-background-only)
* [no-dupe-features](#no-duplicate-features)
* [no-dupe-scenarios](#no-duplicate-scenarios)
* [no-empty-file](#no-empty-file)
* [no-trailing-spaces](#no-trailing-spaces)
* [no-unnamed-scenarios](#no-unnamed-scenarios)

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

### New Line at End of File

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

### No Duplicate Features

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

### No Duplicate Scenarios

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
