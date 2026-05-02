from __future__ import annotations

from pytest_bdd import given, parsers, scenario, then, when
from starlette.testclient import TestClient

from app.main import app
from app.presentation.dependencies import get_shop_service


@scenario("../features/checkout.feature", "Create paid order when cart has products")
def test_checkout_flow():
    pass


@given(parsers.parse('the cart has the product "{product_id}"'), target_fixture="client")
def cart_has_product(product_id: str):
    service = get_shop_service()
    service.remove_from_cart("qa-demo-user", product_id)
    service.add_to_cart("qa-demo-user", product_id)
    return TestClient(app)


@when("checkout is requested", target_fixture="response")
def request_checkout(client: TestClient):
    return client.post("/api/orders/checkout")


@then(parsers.parse('the latest order status should be "{status}"'))
def validate_order_status(response, status: str):
    assert response.status_code == 200
    assert response.json()["status"] == status


@then("the cart should be empty")
def validate_empty_cart(client: TestClient):
    response = client.get("/api/cart")
    assert response.status_code == 200
    assert response.json() == []
