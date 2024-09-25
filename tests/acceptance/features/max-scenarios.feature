Feature: Max Scenarios

  Scenario: Invalid Scenario Count
    Given the following feature file
      """
      Feature: Invalid
        Scenario: One
        Scenario: Two
      """
    When Gherklin is ran with the following configuration
      | rules                           |
      | {"max-scenarios": ["error", 1]} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule          | message                                     |
      | {"line": 1, "column": 1} | error    | max-scenarios | Expected max 1 scenarios per file. Found 2. |

  Scenario: Valid Scenario Count
    Given the following feature file
      """
      Feature: Valid
        Scenario: One
        Scenario: Two
      """
    When Gherklin is ran with the following configuration
      | rules                           |
      | {"max-scenarios": ["error", 3]} |
    Then there is 0 files with errors
