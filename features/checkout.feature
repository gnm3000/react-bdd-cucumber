@smoke @checkout
Feature: Checkout
  Scenario: Successful checkout
    Given the product list is loaded
    When the user adds "Product A" to the cart
    And the user navigates to checkout
    And the user confirms the order
    And the user navigates to orders
    Then the order should be created as paid
    And the cart should be empty
