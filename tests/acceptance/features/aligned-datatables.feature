Feature: Aligned Data Tables

  Scenario: Not Aligned
    Given the following feature file
      """
      Feature: Not Aligned
        Scenario: Something
          Given the following pipes
            | one   | two  |
            | three     | four       |
            | five  | six|
      """
    When Gherklin is ran with the following configuration
      | rules                           |
      | {"aligned-datatables": "error"} |
    Then there is 1 file with errors
    And the errors are
      | location                  | severity | rule               | message                               |
      | {"line": 4, "column": 18} | error    | aligned-datatables | Data table is not formatted correctly |
      | {"line": 4, "column": 31} | error    | aligned-datatables | Data table is not formatted correctly |
      | {"line": 5, "column": 14} | error    | aligned-datatables | Data table is not formatted correctly |
      | {"line": 5, "column": 19} | error    | aligned-datatables | Data table is not formatted correctly |

  Scenario: Aligned
    Given the following feature file
      """
      Feature: Aligned
        Scenario: Something
          Given the following pipes
            | one   | two  |
            | three | four |
            | five  | six  |
      """
    When Gherklin is ran with the following configuration
      | rules                           |
      | {"aligned-datatables": "error"} |
    Then there are 0 files with errors
