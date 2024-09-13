Feature: Indentation

  Scenario: Valid Indentation
    Given I do something
    When I do something else
    Then I should have done something
    And I should have done something else
    But I shouldn't have done nothing

  Scenario Outline: Valid Indentation
    When I do each of these things
      | <THING> |
    Then I should have done something

    Examples:
      | THING |
      | sleep |
      | eat   |
