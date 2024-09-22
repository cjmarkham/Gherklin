Feature: No Dupe Scenarios

  Scenario: Duplicate Scenarios
    Given the following feature file named "invalid"
      """
      Feature: Invalid
        Scenario: One
        Scenario: One
      """
    When Gherklin is ran with the following rules
      | no-dupe-scenarios |
      | on                |
    Then there is 1 files with errors
    And the errors are
      | location                 | severity | rule              | message                                              |
      | {"line": 3, "column": 3} | warn     | no-dupe-scenarios | Found duplicate scenario "One" in "invalid.feature". |
