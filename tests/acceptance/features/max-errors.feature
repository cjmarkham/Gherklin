Feature: Max Errors

  Scenario: Failing process when error count > max-errors
    Given the following feature file
      """
      @invalid-tag
       Feature: Invalid Tag
      """
    When Gherklin is ran with the following configuration
      | rules                                                                                     | maxErrors |
      | {"allowed-tags": ["error", ["@development"]], "indentation": ["error", { "feature": 1 }]} | 1         |
    Then there is 1 file with errors
    And the linter fails
    And the errors are
      | location                 | severity | rule         | message                                                                        |
      | {"line": 1, "column": 1} | error    | allowed-tags | Found a feature tag that is not allowed. Got @invalid-tag, wanted @development |
      | {"line": 2, "column": 2} | error    | indentation  | Invalid indentation for feature. Got 2, wanted 1                               |

  Scenario: Not failing process when error count = max-errors
    Given the following feature file
      """
      @invalid-tag
      Feature: Invalid Tag
      """
    When Gherklin is ran with the following configuration
      | rules                                                               | maxErrors |
      | {"allowed-tags": ["@development"], "indentation": { "feature": 1 }} | 1         |
    Then there is 1 file with errors
    And the linter succeeds

  Scenario: Not failing process when error count < max-errors
    Given the following feature file
      """
      @invalid-tag
      Feature: Invalid Tag
      """
    * the following feature file
      """
        Feature: Invalid Tag
      """
    When Gherklin is ran with the following configuration
      | rules                                                               | maxErrors |
      | {"allowed-tags": ["@development"], "indentation": { "feature": 1 }} | 4         |
    Then there are 2 files with errors
    And there are 2 total errors
    And the linter succeeds
