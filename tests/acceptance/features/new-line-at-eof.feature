Feature: New Line at EOF

  Scenario: No new line
    Given the following feature file
      """
      Feature: Invalid
        Scenario: One
      """
    When Gherklin is ran with the following configuration
      | rules                        |
      | {"new-line-at-eof": "error"} |
    Then there is 1 files with errors
    And the errors are
      | location                 | severity | rule            | message                     |
      | {"line": 2, "column": 0} | error    | new-line-at-eof | No new line at end of file. |

  Scenario: No new line with fix
    Given the following feature file
      """
      Feature: Invalid
        Scenario: One
      """
    When the file is loaded
    Then there is no new line at the end
    When Gherklin is ran with the following configuration
      | rules                        | fix  |
      | {"new-line-at-eof": "error"} | true |
    Then there are 0 files with errors
    When the file is loaded
    Then there is a new line at the end

  Scenario: Has new line
    Given the following feature file
      """
      Feature: Invalid
        Scenario: One

      """
    When Gherklin is ran with the following configuration
      | rules                        |
      | {"new-line-at-eof": "error"} |
    Then there is 0 files with errors
