Feature: No Dupe Features

  Scenario: Duplicate Features
    Given the following feature file named "invalid-1"
      """
      Feature: Invalid
      """
    And the following feature file named "invalid-2"
      """
      Feature: Invalid
      """
    When Gherklin is ran with the following configuration
      | rules                      |
      | {"no-dupe-features": "on"} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule             | message                                                                      |
      | {"line": 1, "column": 1} | warn     | no-dupe-features | Found duplicate feature "Invalid" in "invalid-2.feature, invalid-1.feature". |
