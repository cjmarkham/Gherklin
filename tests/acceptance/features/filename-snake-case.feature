Feature: File Name Snake Case

  Scenario Outline: Invalid
    Given the following feature files
      | name       |
      | <FILENAME> |
    When Gherklin is ran with the following configuration
      | rules                         |
      | {"filename-snake-case": "on"} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule                | message                                                    |
      | {"line": 1, "column": 1} | warn     | filename-snake-case | File names should be snake_case. Got "<FILENAME>.feature". |

    Examples:
      | FILENAME            |
      | kebab-case          |
      | snake_case-mixed    |
      | PascalCase          |
      | camelCase           |
      | spaces case         |
      | snake_With_capitals |

  Scenario Outline: Valid
    Given the following feature files
      | name       |
      | <FILENAME> |
    When Gherklin is ran with the following configuration
      | rules                         |
      | {"filename-snake-case": "on"} |
    Then there are 0 files with errors

    Examples:
      | FILENAME        |
      | snake_case      |
      | long_snake_case |
      | nocase          |
