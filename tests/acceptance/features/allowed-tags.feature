Feature: Allowed Tags

  Scenario: Invalid Tags
    Given the following feature file
      """
      @invalid-tag
      Feature: Invalid Tag
      """
    When Gherklin is ran with the following rules
      | allowed-tags   |
      | [@development] |
    Then there is 1 error
    And the errors are
      | location                 | severity | rule         | message                                                                        |
      | {"line": 1, "column": 1} | warn     | allowed-tags | Found a feature tag that is not allowed. Got @invalid-tag, wanted @development |

  Scenario: Valid Tags
    Given the following feature file
      """
      @development
      Feature: Valid Tag
      """
    When Gherklin is ran with the following rules
      | allowed-tags   |
      | [@development] |
    Then there are 0 errors
