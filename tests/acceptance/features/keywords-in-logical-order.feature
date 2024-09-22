Feature: Keywords in Logical Order

  Scenario: Invalid Order
    Given the following feature file
      """
      Feature: Keywords in Logical Order
        Scenario: Invalid
          Then something should have happened
          When something happens
          Given I do something
          And another thing didn't happen
      """
    When Gherklin is ran with the following rules
      | keywords-in-logical-order |
      | on                        |
    Then there is 1 files with errors
    And there is 2 errors in the file
    And the errors are
      | location                 | severity | rule                      | message                                               |
      | {"line": 4, "column": 5} | warn     | keywords-in-logical-order | Expected "When" to be followed by "Then", got "Given" |
      | {"line": 5, "column": 5} | warn     | keywords-in-logical-order | Expected "Given" to be followed by "When", got "And"  |

  Scenario: Valid Order
    Given the following feature file
      """
      Feature: Keywords in Logical Order
        Scenario: Valid
          Given I do something
          When something happens
          Then something should have happened
          And another thing didn't happen
      """
    When Gherklin is ran with the following rules
      | keywords-in-logical-order |
      | on                        |
    Then there is 0 files with errors
