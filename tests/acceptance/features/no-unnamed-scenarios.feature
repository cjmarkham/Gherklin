Feature: No Unnamed Scenarios

  Scenario: Unnamed
    Given the following feature file
      """
      Feature: Unnamed
        Scenario:
          When something happens
          Then something has happened
      """
    When Gherklin is ran with the following configuration
      | rules                          |
      | {"no-unnamed-scenarios": "on"} |
    Then there is 1 files with errors
    And the errors are
      | location                 | severity | rule                 | message                      |
      | {"line": 2, "column": 3} | warn     | no-unnamed-scenarios | Found scenario with no name. |
