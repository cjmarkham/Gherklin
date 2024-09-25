Feature: No Single Example Outline

  Scenario: Single Example
    Given the following feature file
      """
      Feature: Single Example
        Scenario Outline:
          When transmogrification happens
          Then <PERSON> becomes <OTHER>
        Examples:
          | PERSON | OTHER |
          | Kryten | Human |
      """
    When Gherklin is ran with the following configuration
      | rules                               |
      | {"no-single-example-outline": "on"} |
    Then there is 1 files with errors
    And the errors are
      | location                 | severity | rule                      | message                                                                          |
      | {"line": 2, "column": 3} | warn     | no-single-example-outline | Scenario Outline has only one example. Consider converting to a simple Scenario. |
