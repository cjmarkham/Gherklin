Feature: No Similar Scenarios

  Scenario: This scenario is exactly the same as the below
    Given I do something
    When I do something else
    Then I should have done something
    And I should have done something else
    But I shouldn't have done nothing

  Scenario: This scenario is exactly the same as the above
    Given I do something
    When I do something else
    Then I should have done something
    And I should have done something else
    But I shouldn't have done anything

  Scenario: This is another scenario which is exactly the same
    Given I do something
    When I do something different
    Then I should have maybe done something
    And I should have done something else, perhaps
    But then this is a bit different
