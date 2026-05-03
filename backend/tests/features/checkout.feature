Feature: Checkout flow
  Scenario: Create paid order when cart has products
    Given the cart has the product "p1"
    When checkout is requested
    Then the latest order status should be "paid"
    And the cart should be empty
