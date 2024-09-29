Feature: Scenario Name Length

  Scenario: Invalid
    Given the following feature file
      """
      Feature: Invalid
        Scenario: Doing something but expressing it using a really long title
      """
    When Gherklin is ran with the following configuration
      | rules                        |
      | {"scenario-name-length": 10} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule                 | message                                             |
      | {"line": 2, "column": 3} | warn     | scenario-name-length | Scenario name is too long. Expected max 10, got 59. |

  Scenario: Valid
    Given the following feature file
      """
      Feature: Valid
        Scenario: Doing something
      """
    When Gherklin is ran with the following configuration
      | rules                                    |
      | {"scenario-name-length": ["error", 100]} |
    Then there are 0 files with errors
