Feature: No Inconsistent Quotes

  Scenario: ' mixed with "
    Given the following feature file
      """
      Feature: Invalid
        Scenario: One
          When I do "something"
          Then 'something' has happened
      """
    When Gherklin is ran with the following configuration
      | rules                            |
      | {"no-inconsistent-quotes": "on"} |
    Then there is 1 file with errors
    And the errors are
      | location                  | severity | rule                   | message                                  |
      | {"line": 3, "column": 15} | warn     | no-inconsistent-quotes | Found a mix of single and double quotes. |
      | {"line": 4, "column": 10} | warn     | no-inconsistent-quotes | Found a mix of single and double quotes. |

  Scenario: Only ' used
    Given the following feature file
      """
      Feature: Invalid
        Scenario: One
          When I do 'something'
          Then 'something' has happened
      """
    When Gherklin is ran with the following configuration
      | rules                            |
      | {"no-inconsistent-quotes": "on"} |
    Then there are 0 files with errors

  Scenario: Only " used
    Given the following feature file
      """
      Feature: Invalid
        Scenario: One
          When I do "something"
          Then "something" has happened
      """
    When Gherklin is ran with the following configuration
      | rules                            |
      | {"no-inconsistent-quotes": "on"} |
    Then there are 0 files with errors

  Scenario: Auto Fix
    Given the following feature file
      """
      Feature: Invalid
        Scenario: One
          When I do "something"
          Then 'something' has happened
      """
    When Gherklin is ran with the following configuration
      | rules                            | fix  |
      | {"no-inconsistent-quotes": "on"} | true |
    Then there are 0 files with errors
    And the file has the content
      | line | content               |
      | 3    | When I do 'something' |

  Scenario: Auto Fix with Argument
    Given the following feature file
      """
      Feature: Invalid
        Scenario: One
          When I do "something"
          Then 'something' has happened
      """
    When Gherklin is ran with the following configuration
      | rules                                      | fix  |
      | {"no-inconsistent-quotes": ["warn", "\""]} | true |
    Then there are 0 files with errors
    And the file has the content
      | line | content               |
      | 3    | When I do "something" |
