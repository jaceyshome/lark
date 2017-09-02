Feature: Component data-js-repeat
  Background:
    Test data-js-repeat component
    Given   The default page

  Scenario: Add an item
    When    I create a list item
    Then    I should see it appears in the list

  Scenario: Delete an item
    When    I delete a list item
    Then    I should see it disappears form the list