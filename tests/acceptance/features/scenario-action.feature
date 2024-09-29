Feature: Scenario Action

  Scenario: Invalid
    Given the following feature file
      """
      Feature: Invalid
        Scenario: Doing something
          Given I do something
          Then I should have done something
      """
    When Gherklin is ran with the following configuration
      | rules                        |
      | {"scenario-action": "error"} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule            | message                                               |
      | {"line": 2, "column": 3} | error    | scenario-action | Scenario should contain a "When" to denote an action. |

  Scenario: Valid
    Given the following feature file
      """
      Feature: Valid
        Scenario: Doing something
          When I do something
          Then I should have done something
      """
    When Gherklin is ran with the following configuration
      | rules                        |
      | {"scenario-action": "error"} |
    Then there are 0 files with errors
