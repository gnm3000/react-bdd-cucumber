from __future__ import annotations

from collections import defaultdict
from typing import Any, Mapping

from app.domain.entities import Cart, CartItem, Order, OrderStatus, Product

DatabaseRow = Mapping[str, Any]
CartItemInsertRow = tuple[str, str, int]
OrderItemInsertRow = tuple[str, str, int]


def to_product(row: DatabaseRow) -> Product:
    return Product(id=row["id"], name=row["name"], price=row["price"])


def to_cart(rows: list[DatabaseRow]) -> Cart:
    return Cart([to_cart_item(row) for row in rows])


def to_cart_item(row: DatabaseRow) -> CartItem:
    return CartItem(product_id=row["product_id"], quantity=row["quantity"])


def to_orders(order_rows: list[DatabaseRow], item_rows: list[DatabaseRow]) -> list[Order]:
    items_by_order: dict[str, list[CartItem]] = defaultdict(list)
    for row in item_rows:
        items_by_order[row["order_id"]].append(to_cart_item(row))

    return [to_order(row, items_by_order[row["id"]]) for row in order_rows]


def to_order(row: DatabaseRow, items: list[CartItem]) -> Order:
    return Order(
        id=row["id"],
        user_id=row["user_id"],
        items=items,
        total=row["total"],
        status=OrderStatus(row["status"]),
    )


def to_cart_item_insert_rows(user_id: str, cart: Cart) -> list[CartItemInsertRow]:
    return [(user_id, item.product_id, item.quantity) for item in cart.items]


def to_order_item_insert_rows(order: Order) -> list[OrderItemInsertRow]:
    return [(order.id, item.product_id, item.quantity) for item in order.items]
