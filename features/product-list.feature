@smoke @products
Feature: Product list
  As a shopper
  I want to see products
  So that I can add items to cart

  Scenario: Add a product from catalog
    Given the product list is loaded
    When the user adds "Product A" to the cart
    Then the cart count should be 1
