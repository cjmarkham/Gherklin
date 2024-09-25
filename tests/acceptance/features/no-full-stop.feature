Feature: No Full Stop

  Scenario: Contains Full Stop
    Given the following feature file
      """
      Feature: Some feature
        When I do something
        Then something has happened.
      """
    When Gherklin is ran with the following configuration
      | rules                     |
      | {"no-full-stop": "error"} |
    Then there is 1 files with errors
    And the errors are
      | location                  | severity | rule         | message                     |
      | {"line": 3, "column": 28} | error    | no-full-stop | Line ends with a full stop. |

  Scenario: Contains Full Stop with Trailing Spaces

  If editing this file, be aware that line 26 is supposed to have 3 trailing spaces

    Given the following feature file
      """
      Feature: Some feature
        When I do something
        Then something has happened.   
      """
    When Gherklin is ran with the following configuration
      | rules                     |
      | {"no-full-stop": "error"} |
    Then there is 1 files with errors
    And the errors are
      | location                  | severity | rule         | message                     |
      | {"line": 3, "column": 28} | error    | no-full-stop | Line ends with a full stop. |

  Scenario: Auto fix
    Given the following feature file
      """
      Feature: Some feature
        When I do something
        Then something has happened.
      """
    When Gherklin is ran with the following configuration
      | rules                     | fix  |
      | {"no-full-stop": "error"} | true |
    Then there are 0 files with errors
