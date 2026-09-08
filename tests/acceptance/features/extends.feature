Feature: Extend Presets

  Scenario: Extend the recommended preset

  no-unnamed-scenarios is an error in gherklin:recommended

    Given the following feature file
      """
      Feature: Something
        Scenario:
          Given something
          When action
          Then something happens

      """
    When Gherklin is ran with the following configuration
      | extends                |
      | [gherklin:recommended] |
    Then there is 1 file with errors
    And the errors are
      | location                 | severity | rule                 | message                      |
      | {"line": 2, "column": 3} | error    | no-unnamed-scenarios | Found scenario with no name. |

  Scenario: Local rules override recommended preset rules

  no-unnamed-scenarios is an error in gherklin:recommended
  but we override here with rules

    Given the following feature file
      """
      Feature: Something
        Scenario:
          Given something
          When action
          Then something happens

      """
    When Gherklin is ran with the following configuration
      | extends                | rules                           |
      | [gherklin:recommended] | {"no-unnamed-scenarios": "off"} |
    Then there are 0 files with errors

  Scenario: Configuration without extends remains valid
    Given the following feature file
      """
      Feature: Something
        Scenario: Foobar

      """
    When Gherklin is ran with the following configuration
      | rules                           |
      | {"no-unnamed-scenarios": "error"} |
    Then there are 0 files with errors

  Scenario: Unknown preset fails configuration
    Given the following feature file
      """
      Feature: Something
        Scenario:
          Given something
          When action
          Then something happens

      """
    When Gherklin is ran with the following configuration
      | extends                |
      | [something] |
    Then the caught error is Could not find Gherklin preset "something".
