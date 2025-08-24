Feature: Indentation

  Scenario: Invalid Indentation
    Given the following feature file
      """
      Feature: Invalid
      Scenario: Doing something
          Given I do something
         When I do another thing
                Then I should have done something
             And another thing
       But not done nothing
      """
    When Gherklin is ran with the following configuration
      | rules                                                                                                |
      | {"indentation": {"feature": 1, "scenario": 3, "given": 3, "when": 3, "then": 3, "and": 3, "but": 3}} |
    Then there is 1 file with errors
    And the errors are
      | location                  | severity | rule        | message                                           |
      | {"line": 2, "column": 1}  | warn     | indentation | Invalid indentation for scenario. Got 1, wanted 3 |
      | {"line": 3, "column": 5}  | warn     | indentation | Invalid indentation for "given". Got 5, wanted 3  |
      | {"line": 4, "column": 4}  | warn     | indentation | Invalid indentation for "when". Got 4, wanted 3   |
      | {"line": 5, "column": 11} | warn     | indentation | Invalid indentation for "then". Got 11, wanted 3  |
      | {"line": 6, "column": 8}  | warn     | indentation | Invalid indentation for "and". Got 8, wanted 3    |
      | {"line": 7, "column": 2}  | warn     | indentation | Invalid indentation for "but". Got 2, wanted 3    |

  Scenario: Valid Indentation
    Given the following feature file
      """
      Feature: Invalid
        Scenario: Doing something
          Given I do something
          When I do another thing
          Then I should have done something
          And another thing
          But not done nothing
      """
    When Gherklin is ran with the following configuration
      | rules                                                                                                |
      | {"indentation": {"feature": 1, "scenario": 3, "given": 5, "when": 5, "then": 5, "and": 5, "but": 5}} |
    Then there is 0 files with errors

  Scenario: Auto fix
    Given the following feature file
      """
      Feature: Invalid Tag
      Scenario Outline: Doing something
      """
    When Gherklin is ran with the following configuration
      | rules                                                                                                                       | fix  |
      | {"indentation": {"feature": 1, "scenario": 3, "given": 5, "when": 5, "then": 5, "and": 5, "but": 5, "scenarioOutline": 3}} | true |
    Then there are 0 files with errors
    And the file has the content
      | line | content                           |
      | 2    | Scenario Outline: Doing something |
