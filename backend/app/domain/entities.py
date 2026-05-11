from __future__ import annotations

from dataclasses import dataclass
from enum import StrEnum


@dataclass(frozen=True)
class Product:
    id: str
    name: str
    price: int


@dataclass
class CartItem:
    product_id: str
    quantity: int


class Cart:
    def __init__(self, items: list[CartItem] | None = None) -> None:
        self._items = items or []

    @property
    def items(self) -> list[CartItem]:
        return [
            CartItem(product_id=item.product_id, quantity=item.quantity)
            for item in self._items
        ]

    @property
    def is_empty(self) -> bool:
        return not self._items

    def add_product(self, product: Product, quantity: int = 1) -> None:
        existing = self._find_item(product.id)
        if existing:
            existing.quantity += quantity
            return

        self._items.append(CartItem(product_id=product.id, quantity=quantity))

    def remove_one(self, product_id: str) -> None:
        self._items = [
            item
            for item in self._items
            if item.product_id != product_id or self._decrease_quantity(item)
        ]

    def total(self, products: list[Product]) -> int:
        products_by_id = {product.id: product for product in products}
        return sum(
            products_by_id[item.product_id].price * item.quantity
            for item in self._items
        )

    def checkout(self, user_id: str, order_id: str, products: list[Product]) -> Order:
        if self.is_empty:
            raise ValueError("Cannot checkout an empty cart")

        return Order(
            id=order_id,
            user_id=user_id,
            items=self.items,
            total=self.total(products),
            status=OrderStatus.PAID,
        )

    def clear(self) -> None:
        self._items = []

    def _find_item(self, product_id: str) -> CartItem | None:
        return next(
            (item for item in self._items if item.product_id == product_id),
            None,
        )

    @staticmethod
    def _decrease_quantity(item: CartItem) -> bool:
        item.quantity -= 1
        return item.quantity > 0


class OrderStatus(StrEnum):
    PAID = "paid"


@dataclass(frozen=True)
class Order:
    id: str
    user_id: str
    items: list[CartItem]
    total: int
    status: OrderStatus
