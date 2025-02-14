Feature: Keywords in Logical Order

  Scenario: Invalid Order
    Given the following feature file
      """
      Feature: Keywords in Logical Order
        Scenario: Invalid
          Then something should have happened
          And something didn't happen
          When something happens
          Given I do something
          And another thing didn't happen
      """
    When Gherklin is ran with the following configuration
      | rules                               |
      | {"keywords-in-logical-order": "on"} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule                      | message                                               |
      | {"line": 5, "column": 5} | warn     | keywords-in-logical-order | Expected "When" to be followed by "And, But, Then", got "Given" |

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
    When Gherklin is ran with the following configuration
      | rules                               |
      | {"keywords-in-logical-order": "on"} |
    Then there is 0 files with errors

  Scenario: Conjunction step
    Given the following feature file
      """
      Feature: Keywords in Logical Order
        Scenario: Invalid
          Given I have shades
          And I have a brand new Mustang
      """
    When Gherklin is ran with the following configuration
      | rules                               |
      | {"keywords-in-logical-order": "on"} |
    Then there are 0 files with errors
