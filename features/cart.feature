@regression @cart
Feature: Cart management
  Scenario: Cart keeps added items and total
    Given the product list is loaded
    When the user adds "Product A" to the cart
    And the user adds "Product B" to the cart
    And the user navigates to cart
    Then the cart total should be 300
