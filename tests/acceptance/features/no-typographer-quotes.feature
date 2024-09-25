Feature: No Typographer Quotes

  Scenario: Containes Typographer Quotes
    Given the following feature file
      """
      Feature: Invalid
        Scenario: Doing something
          When I do “something”
          Then I did ‘something’
      """
    When Gherklin is ran with the following configuration
      | rules                              |
      | {"no-typographer-quotes": "error"} |
    Then there is 1 files with errors
    And the errors are
      | location                  | severity | rule                  | message                 |
      | {"line": 3, "column": 15} | error    | no-typographer-quotes | Found typographer quote |
      | {"line": 3, "column": 25} | error    | no-typographer-quotes | Found typographer quote |
      | {"line": 4, "column": 16} | error    | no-typographer-quotes | Found typographer quote |
      | {"line": 4, "column": 26} | error    | no-typographer-quotes | Found typographer quote |

  Scenario: Auto Fix
    Given the following feature file
      """
      Feature: Invalid
        Scenario: Doing something
          When I do “something”
          Then I did ‘something’
      """
    When Gherklin is ran with the following configuration
      | rules                              | fix  |
      | {"no-typographer-quotes": "error"} | true |
    Then there are 0 files with errors
    And the file has the content
      | line | content                |
      | 3    | When I do 'something'  |
      | 4    | Then I did 'something' |

  Scenario: Auto Fix with parameter
    Given the following feature file
      """
      Feature: Invalid
        Scenario: Doing something
          When I do “something”
          Then I did ‘something’
      """
    When Gherklin is ran with the following configuration
      | rules                                      | fix  |
      | {"no-typographer-quotes": ["error", "\""]} | true |
    Then there are 0 files with errors
    And the file has the content
      | line | content                |
      | 3    | When I do "something"  |
      | 4    | Then I did "something" |
