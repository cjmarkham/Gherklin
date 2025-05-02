Feature: Not Allowed Tags

  Scenario: Invalid Tags
    Given the following feature file
      """
      @testing
      Feature: Invalid Tag
      """
    When Gherklin is ran with the following configuration
      | rules                                  |
      | {"disallowed-tags": ["@testing"]}      |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule             | message                                                  |
      | {"line": 1, "column": 1} | warn     | disallowed-tags  | Found a feature tag that is not allowed. Got '@testing'. |

  Scenario: Valid Tags
    Given the following feature file
      """
      @valid
      Feature: Valid Tag
      """
    When Gherklin is ran with the following configuration
      | rules                                  |
      | {"disallowed-tags": ["@testing"]}      |
    Then there are 0 files with errors
