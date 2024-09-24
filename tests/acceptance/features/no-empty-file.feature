Feature: No Empty File

  Scenario: File is empty
    Given the following feature file
      """
      """
    When Gherklin is ran with the following configuration
      | rules                   |
      | {"no-empty-file": "on"} |
    Then there is 1 files with errors
    And the errors are
      | location                 | severity | rule          | message                |
      | {"line": 0, "column": 0} | warn     | no-empty-file | Feature file is empty. |
