Feature: No Similar Scenarios

  Scenario: Scenarios > 90% similar
    Given the following feature file
      """
      Feature: Similar Scenarios
        Scenario: Scenario 1
          When something happens
          Then something has happened

        Scenario: Scenario 2
          When something happens
          Then something will have happened
      """
    When Gherklin is ran with the following configuration
      | rules                                   |
      | {"no-similar-scenarios": ["error", 90]} |
    Then there is 1 files with errors
    And the errors are
      | location                 | severity | rule                 | message                                                                |
      | {"line": 2, "column": 3} | error    | no-similar-scenarios | Scenario "Scenario 1" is too similar (> 90%) to scenario "Scenario 2". |
      | {"line": 6, "column": 3} | error    | no-similar-scenarios | Scenario "Scenario 2" is too similar (> 90%) to scenario "Scenario 1". |
