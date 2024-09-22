Feature: Single Example Outline

  Scenario Outline:
    When I initiate transmogrification
    Then <PERSON> becomes <OTHER>
    Examples:
      | PERSON | OTHER         |
      | Dave   | Super Soldier |
      | Kryten | Human         |
