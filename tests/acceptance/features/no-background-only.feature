Feature: No Background Only

  Scenario: Only Background
    Given the following feature file
      """
      Feature: Invalid
        Background: Something
      """
    When Gherklin is ran with the following configuration
      | rules                        |
      | {"no-background-only": "on"} |
    Then there is 1 files with errors
    And the errors are
      | location                 | severity | rule               | message                          |
      | {"line": 1, "column": 1} | warn     | no-background-only | File contains only a background. |

  Scenario: Background with Scenarios
    Given the following feature file
      """
      Feature: Invalid
        Background: Something

        Scenario: Something
      """
    When Gherklin is ran with the following configuration
      | rules                        |
      | {"no-background-only": "on"} |
    Then there is 0 files with errors
