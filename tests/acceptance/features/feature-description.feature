Feature: Feature Description

  Scenario: Invalid
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
      | rules                            |
      | {"feature-description": "error"} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule                | message                           |
      | {"line": 1, "column": 1} | error    | feature-description | Feature is missing a description. |

  Scenario: Valid
    Given the following feature file
      """
      Feature: Valid
      
      This feature has a description
      
        Scenario: Doing something
          Given I do something
          When I do another thing
          Then I should have done something
          And another thing
          But not done nothing
      """
    When Gherklin is ran with the following configuration
      | rules                            |
      | {"feature-description": "error"} |
    Then there are 0 files with errors
