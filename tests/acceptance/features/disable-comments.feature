Feature: Disabling Comments

  The comment # gherklin-disable can be added to the top of any file.
  If this comment is present, the file will be skipped for rule validation.

  Scenario: Disable whole file
    Given the following feature file
        """
        # gherklin-disable
        @invalid-tag
        Feature: Invalid Tag
        """
    When Gherklin is ran with the following rules
      | allowed-tags   |
      | [@development] |
    Then there are 0 files with errors

  Scenario: Disable whole file regardless of indentation
    Given the following feature file
        """
                # gherklin-disable
        @invalid-tag
        Feature: Invalid Tag
        """
    When Gherklin is ran with the following rules
      | allowed-tags   |
      | [@development] |
    Then there are 0 files with errors

  Scenario: Disable comment is not on the first line

  Gherklin only checks the first line when disabling the whole file

    Given the following feature file
        """
        @invalid-tag
        # gherklin-disable
        Feature: Invalid Tag
        """
    When Gherklin is ran with the following rules
      | allowed-tags   |
      | [@development] |
    Then there are 1 files with errors

  Scenario: Disable whole file but comment is not correctly formatted
    Given the following feature file
        """
        #gherklin-disable
        @invalid-tag
        Feature: Invalid Tag
        """
    When Gherklin is ran with the following rules
      | allowed-tags   |
      | [@development] |
    Then there are 1 file with errors

  Scenario: Disable next line
    Given the following feature file
        """
        Feature: Empty Scenario
          # gherklin-disable-next-line
          Scenario:
        """
    When Gherklin is ran with the following rules
      | no-unnamed-scenarios |
      | on                   |
    Then there are 0 files with errors

  Scenario: Disable next line regardless of indentation
    Given the following feature file
        """
        Feature: Empty Scenario
                  # gherklin-disable-next-line
          Scenario:
        """
    When Gherklin is ran with the following rules
      | no-unnamed-scenarios |
      | on                   |
    Then there are 0 files with errors

  Scenario: Disable next line but comment is not correctly formatted
    Given the following feature file
        """
        Feature: Empty Scenario
          #gherklin-disable-next-line
          Scenario:
        """
    When Gherklin is ran with the following rules
      | no-unnamed-scenarios |
      | on                   |
    Then there are 1 file with errors

  Scenario: Disable specific rule
    Given the following feature file
        """
        # gherklin-disable no-unnamed-scenarios, something-else
        Feature: Empty Scenario
          Scenario:
        """
    When Gherklin is ran with the following rules
      | no-unnamed-scenarios |
      | on                   |
    Then there are 0 files with errors

  Scenario: Disable specific rule regradless of indentation
    Given the following feature file
        """
              # gherklin-disable no-unnamed-scenarios
        Feature: Empty Scenario
          Scenario:
        """
    When Gherklin is ran with the following rules
      | no-unnamed-scenarios |
      | on                   |
    Then there are 0 files with errors

  Scenario: Disable specific rule but comment is not correctly formatted
    Given the following feature file
        """
        #gherklin-disable no-unnamed-scenarios, something-else
        Feature: Empty Scenario
          Scenario:
        """
    When Gherklin is ran with the following rules
      | no-unnamed-scenarios |
      | on                   |
    Then there are 1 file with errors

  Scenario: Disable specific rule with no space between rules
    Given the following feature file
        """
        # gherklin-disable no-unnamed-scenarios,something-else
        Feature: Empty Scenario
          Scenario:
        """
    When Gherklin is ran with the following rules
      | no-unnamed-scenarios |
      | on                   |
    Then there are 0 files with errors
