Feature: Matching Pipes

  Scenario: Not Matching
    Given the following feature file
      """
      Feature: Not Matching
        Scenario: Something
          Given the following pipes
            | one   | two  |
            | three     | four       |
            | five  | six|
      """
    When Gherklin is ran with the following configuration
      | rules                       |
      | {"matching-pipes": "error"} |
    Then there is 1 file with errors
    And the errors are
      | location                  | severity | rule           | message                               |
      | {"line": 4, "column": 18} | error    | matching-pipes | Data table is not formatted correctly |
      | {"line": 4, "column": 31} | error    | matching-pipes | Data table is not formatted correctly |
      | {"line": 5, "column": 14} | error    | matching-pipes | Data table is not formatted correctly |
      | {"line": 5, "column": 19} | error    | matching-pipes | Data table is not formatted correctly |

  Scenario: Matching
    Given the following feature file
      """
      Feature: Matching
        Scenario: Something
          Given the following pipes
            | one   | two  |
            | three | four |
            | five  | six  |
      """
    When Gherklin is ran with the following configuration
      | rules                       |
      | {"matching-pipes": "error"} |
    Then there are 0 files with errors
