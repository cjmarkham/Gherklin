Feature: No Scenario Splat

  Scenario: Splat in Scenario
    Given the following feature file
      """
      Feature: Keywords in Logical Order
        Scenario: Invalid
          When I create one thing
          * and another
          * and another another
          Then 3 things are created
      """
    When Gherklin is ran with the following configuration
      | rules                       |
      | {"no-scenario-splat": "on"} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule              | message                              |
      | {"line": 4, "column": 5} | warn     | no-scenario-splat | Found a splat (*) inside a scenario. |
      | {"line": 5, "column": 5} | warn     | no-scenario-splat | Found a splat (*) inside a scenario. |

  Scenario: Splat in Background
    Given the following feature file
      """
      Feature: Keywords in Logical Order
        Background:
          Given I create one thing
          * and another
        Scenario: Invalid
          When I create one thing
          Then 3 things are created
      """
    When Gherklin is ran with the following configuration
      | rules                       |
      | {"no-scenario-splat": "on"} |
    Then there are 0 files with errors
