Feature: Background Setup Only

  Scenario: Invalid
    Given the following feature file
      """
      Feature: Invalid
        Background: One
          Given I set something up
          Then something should be set up
          And I confirm it was set up
      """
    When Gherklin is ran with the following configuration
      | rules                              |
      | {"background-setup-only": "error"} |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule                  | message                                                  |
      | {"line": 4, "column": 5} | error    | background-setup-only | Background should only be used for set up. Found "Then". |
      | {"line": 5, "column": 5} | error    | background-setup-only | Background should only be used for set up. Found "And".  |

  Scenario: Valid
    Given the following feature file
      """
      Feature: Valid
        Background: One
          Given I set something up
        Scenario: 
          When I do something
          Then something has been done
      """
    When Gherklin is ran with the following configuration
      | rules                              |
      | {"background-setup-only": "error"} |
    Then there are 0 files with errors
