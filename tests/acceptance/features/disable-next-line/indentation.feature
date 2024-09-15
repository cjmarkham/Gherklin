# gherklin-disable-next-line
  Feature: Indentation
# gherklin-disable-next-line
 Scenario: Valid Indentation
      # gherklin-disable-next-line
      Given I do something
        # gherklin-disable-next-line
       When I do something else
   # gherklin-disable-next-line
             Then I should have done something
      # gherklin-disable-next-line
      And I should have done something else
          # gherklin-disable-next-line
         But I shouldn't have done nothing

   # gherklin-disable-next-line
          Scenario Outline:
            # gherklin-disable-next-line
              Given I do something
              # gherklin-disable-next-line
                    | <like> |
# gherklin-disable-next-line
Examples:
# gherklin-disable-next-line
          | like |
          # gherklin-disable-next-line
              | eat   |
