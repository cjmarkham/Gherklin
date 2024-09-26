Feature: File Name Kebab Case

  Scenario Outline: Invalid
    Given the following feature files
      | name       |
      | <FILENAME> |
    When Gherklin is ran with the following configuration
      | rules                         |
      | {"filename-kebab-case": "on"} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule                | message                                                    |
      | {"line": 1, "column": 1} | warn     | filename-kebab-case | File names should be kebab-case. Got "<FILENAME>.feature". |

    Examples:
      | FILENAME            |
      | PascalCase          |
      | camelCase           |
      | spaces case         |
      | snake_With_capitals |
      | snake_case          |
      | kebab-With-capitals |

  Scenario Outline: Valid
    Given the following feature files
      | name       |
      | <FILENAME> |
    When Gherklin is ran with the following configuration
      | rules                         |
      | {"filename-kebab-case": "on"} |
    Then there are 0 files with errors

    Examples:
      | FILENAME        |
      | kebab-case      |
      | long-kebab-case |
      | nocase          |
