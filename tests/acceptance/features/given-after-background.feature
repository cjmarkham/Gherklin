Feature: Given After Background

  Scenario: Invalid
    Given the following feature file
      """
      Feature: Given After Background
        Background:
          Given I set something up
          * and another thing

        Scenario:
          Given something else is set up
      """
    When Gherklin is ran with the following configuration
      | rules                            |
      | {"given-after-background": "on"} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule                   | message                                           |
      | {"line": 7, "column": 5} | warn     | given-after-background | Found "Given" in scenario when background exists. |

  Scenario: Valid
    Given the following feature file
      """
      Feature: Valid
        Background:
          Given I set something up
          * and another thing

        Scenario:
          When I take an action
      """
    When Gherklin is ran with the following configuration
      | rules                            |
      | {"given-after-background": "on"} |
    Then there are 0 files with errors

  Scenario: No Background
    Given the following feature file
      """
      Feature: Valid
        Scenario:
          Given I set something up
          When I take an action
      """
    When Gherklin is ran with the following configuration
      | rules                            |
      | {"given-after-background": "on"} |
    Then there are 0 files with errors
