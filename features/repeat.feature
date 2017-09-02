Feature: Component data-js-repeat

  Background:
    Test data-js-repeat component
    Given   The default page

  @watch
  Scenario: Add an item
    When    I create a new item
    Then    I should see it appears in the list

  Scenario: Delete an item
    When    I delete an item
    Then    I should see it disappears form the list