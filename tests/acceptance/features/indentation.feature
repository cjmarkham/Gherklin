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
      | {"indentation": {"feature": 1, "scenario": 3, "given": 5, "when": 5, "then": 5, "and": 5, "but": 5}} |
    Then there is 1 file with errors
    And the errors are
      | location                  | severity | rule        | message                                           |
      | {"line": 2, "column": 1}  | warn     | indentation | Invalid indentation for scenario. Got 1, wanted 3 |
      | {"line": 3, "column": 6}  | warn     | indentation | Invalid indentation for given. Got 6, wanted 5  |
      | {"line": 4, "column": 4}  | warn     | indentation | Invalid indentation for when. Got 4, wanted 5   |
      | {"line": 5, "column": 11} | warn     | indentation | Invalid indentation for then. Got 11, wanted 5  |
      | {"line": 6, "column": 8}  | warn     | indentation | Invalid indentation for and. Got 8, wanted 5    |
      | {"line": 7, "column": 2}  | warn     | indentation | Invalid indentation for but. Got 2, wanted 5    |

  Scenario: Invalid Indentation with tables
    Given the following feature file
      """
      Feature: Invalid indentation
        Scenario Outline: With tables
          When I have the following Pokemon
         | <POKEMON> |
          Then I win most rounds
            Examples:
      | POKEMON   |
         | Metapod   |
      | Togepi    |
        | Kakuna    |
      """
    When Gherklin is ran with the following configuration
      | rules                                                                                           |
      | {"indentation": {"feature": 1, "exampleTableHeader": 3, "exampleTableBody": 3, "dataTable": 5}} |
    Then there is 1 file with errors
    And the errors are
      | location                  | severity | rule        | message                                                         |
      | {"line": 4, "column": 4}  | warn     | indentation | Invalid indentation for when data table. Got 4, wanted 5      |
      | {"line": 7, "column": 1}  | warn     | indentation | Invalid indentation for example table header. Got 1, wanted 3 |
      | {"line": 8, "column": 4}  | warn     | indentation | Invalid indentation for example table row. Got 4, wanted 3    |
      | {"line": 9, "column": 1}  | warn     | indentation | Invalid indentation for example table row. Got 1, wanted 3    |

  Scenario: Invalid Indentation with feature tags
    Given the following feature file
      """
         @tag-1
      Feature: Invalid
      """
    When Gherklin is ran with the following configuration
      | rules                              |
      | {"indentation": {"featureTag": 1}} |
    Then there is 1 file with errors
    And the errors are
      | location                  | severity | rule        | message                                               |
      | {"line": 1, "column": 4}  | warn     | indentation | Invalid indentation for feature tags. Got 4, wanted 1 |

  Scenario: Invalid Indentation with scenario tags
    Given the following feature file
      """
      Feature: Invalid
              @tag-1
        Scenario: Doing stuff
      """
    When Gherklin is ran with the following configuration
      | rules                              |
      | {"indentation": {"scenarioTag": 3}} |
    Then there is 1 file with errors
    And the errors are
      | location                  | severity | rule        | message                                               |
      | {"line": 2, "column": 9}  | warn     | indentation | Invalid indentation for scenario tags. Got 9, wanted 3 |

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
      | {"indentation": {"feature": 1, "scenario": 3, "given": 5, "when": 5, "then": 5, "and": 5, "but": 5, "scenarioOutline": 3}}  | true |
    Then there are 0 files with errors
    And the file has the content
      | line | content                           |
      | 2    | Scenario Outline: Doing something |
