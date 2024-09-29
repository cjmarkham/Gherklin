Feature: Unique Examples

  Scenario: Invalid Examples
    Given the following feature file
      """
      Feature: Invalid
        Scenario Outline:
          Given I do <THING>
          Then I should have done <THING>
        Examples:
          | THING |
          | Swim  |
        Examples:
          | THING |
          | Eat   |
      """
    When Gherklin is ran with the following configuration
      | rules                        |
      | {"unique-examples": "error"} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule            | message                                                           |
      | {"line": 8, "column": 3} | error    | unique-examples | Examples should contain a unique name if there are more than one. |

  Scenario: Valid Examples
    Given the following feature file
      """
      Feature: Valid
        Scenario Outline:
          Given I do <THING>
          Then I should have done <THING>
        Examples: Recreational
          | THING |
          | Swim  |
        Examples: Mandatory
          | THING |
          | Eat   |
      """
    When Gherklin is ran with the following configuration
      | rules                        |
      | {"unique-examples": "error"} |
    Then there are 0 files with errors
