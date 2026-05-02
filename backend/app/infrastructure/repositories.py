from __future__ import annotations

from collections import defaultdict

from app.domain.entities import CartItem, Order, Product
from app.domain.repositories import CartRepository, OrderRepository, ProductRepository


class InMemoryProductRepository(ProductRepository):
    def __init__(self) -> None:
        self._products = [
            Product(id="p1", name="Laptop", price=1200),
            Product(id="p2", name="Headphones", price=200),
            Product(id="p3", name="Keyboard", price=100),
        ]

    def list_products(self) -> list[Product]:
        return self._products

    def get_by_id(self, product_id: str) -> Product | None:
        return next((item for item in self._products if item.id == product_id), None)


class InMemoryCartRepository(CartRepository):
    def __init__(self) -> None:
        self._carts: dict[str, list[CartItem]] = defaultdict(list)

    def get_cart(self, user_id: str) -> list[CartItem]:
        return self._carts[user_id]

    def save_cart(self, user_id: str, cart: list[CartItem]) -> None:
        self._carts[user_id] = cart


class InMemoryOrderRepository(OrderRepository):
    def __init__(self) -> None:
        self._orders: dict[str, list[Order]] = defaultdict(list)

    def list_orders(self, user_id: str) -> list[Order]:
        return self._orders[user_id]

    def add_order(self, order: Order) -> None:
        self._orders[order.user_id].append(order)
