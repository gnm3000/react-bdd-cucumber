from __future__ import annotations

import os
from collections import defaultdict
from typing import Any

import psycopg
from psycopg.rows import dict_row

from app.domain.entities import CartItem, Order, OrderStatus, Product
from app.domain.repositories import CartRepository, OrderRepository, ProductRepository

DEFAULT_DATABASE_URL = (
    "host=postgres port=5432 dbname=shopdb " "user=shop_user password=shop_password"
)
DATABASE_URL = os.environ.get("DATABASE_URL", DEFAULT_DATABASE_URL)


class PostgreSQLConnectionMixin:
    def _connect(self):
        return psycopg.connect(DATABASE_URL, row_factory=dict_row)


class PostgreSQLProductRepository(PostgreSQLConnectionMixin, ProductRepository):
    def list_products(self) -> list[Product]:
        with self._connect() as connection:
            rows = connection.execute(
                "SELECT id, name, price FROM products ORDER BY id"
            ).fetchall()

        return [self._to_product(row) for row in rows]

    def get_by_id(self, product_id: str) -> Product | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT id, name, price FROM products WHERE id = %s",
                (product_id,),
            ).fetchone()

        if row is None:
            return None

        return self._to_product(row)

    @staticmethod
    def _to_product(row: dict[str, Any]) -> Product:
        return Product(id=row["id"], name=row["name"], price=row["price"])


class PostgreSQLCartRepository(PostgreSQLConnectionMixin, CartRepository):
    def get_cart(self, user_id: str) -> list[CartItem]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT product_id, quantity
                FROM cart_items
                WHERE user_id = %s
                ORDER BY product_id
                """,
                (user_id,),
            ).fetchall()

        return [
            CartItem(product_id=row["product_id"], quantity=row["quantity"])
            for row in rows
        ]

    def save_cart(self, user_id: str, cart: list[CartItem]) -> None:
        with self._connect() as connection:
            with connection.transaction():
                connection.execute(
                    "DELETE FROM cart_items WHERE user_id = %s",
                    (user_id,),
                )
                if cart:
                    with connection.cursor() as cursor:
                        cursor.executemany(
                            """
                            INSERT INTO cart_items (user_id, product_id, quantity)
                            VALUES (%s, %s, %s)
                            """,
                            [
                                (user_id, item.product_id, item.quantity)
                                for item in cart
                            ],
                        )


class PostgreSQLOrderRepository(PostgreSQLConnectionMixin, OrderRepository):
    def list_orders(self, user_id: str) -> list[Order]:
        with self._connect() as connection:
            order_rows = connection.execute(
                """
                SELECT id, user_id, total, status
                FROM orders
                WHERE user_id = %s
                ORDER BY created_at, id
                """,
                (user_id,),
            ).fetchall()

            if not order_rows:
                return []

            item_rows = connection.execute(
                """
                SELECT order_id, product_id, quantity
                FROM order_items
                WHERE order_id = ANY(%s)
                ORDER BY order_id, product_id
                """,
                ([row["id"] for row in order_rows],),
            ).fetchall()

        items_by_order: dict[str, list[CartItem]] = defaultdict(list)
        for row in item_rows:
            items_by_order[row["order_id"]].append(
                CartItem(product_id=row["product_id"], quantity=row["quantity"])
            )

        return [
            Order(
                id=row["id"],
                user_id=row["user_id"],
                items=items_by_order[row["id"]],
                total=row["total"],
                status=OrderStatus(row["status"]),
            )
            for row in order_rows
        ]

    def get_order(self, order_id: str) -> Order | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT id, user_id, total, status
                FROM orders
                WHERE id = %s
                """,
                (order_id,),
            ).fetchone()

            if row is None:
                return None

            item_rows = connection.execute(
                """
                SELECT product_id, quantity
                FROM order_items
                WHERE order_id = %s
                ORDER BY product_id
                """,
                (order_id,),
            ).fetchall()

        return Order(
            id=row["id"],
            user_id=row["user_id"],
            items=[
                CartItem(product_id=item["product_id"], quantity=item["quantity"])
                for item in item_rows
            ],
            total=row["total"],
            status=OrderStatus(row["status"]),
        )

    def add_order(self, order: Order) -> None:
        with self._connect() as connection:
            with connection.transaction():
                connection.execute(
                    """
                    INSERT INTO orders (id, user_id, total, status)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (order.id, order.user_id, order.total, order.status.value),
                )
                with connection.cursor() as cursor:
                    cursor.executemany(
                        """
                        INSERT INTO order_items (order_id, product_id, quantity)
                        VALUES (%s, %s, %s)
                        """,
                        [
                            (order.id, item.product_id, item.quantity)
                            for item in order.items
                        ],
                    )


class InMemoryProductRepository(ProductRepository):
    def __init__(self) -> None:
        self._products = [
            Product(id="p1", name="Product A", price=100),
            Product(id="p2", name="Product B", price=200),
            Product(id="p3", name="Product C", price=300),
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

    def get_order(self, order_id: str) -> Order | None:
        return next(
            (
                order
                for orders in self._orders.values()
                for order in orders
                if order.id == order_id
            ),
            None,
        )

    def add_order(self, order: Order) -> None:
        self._orders[order.user_id].append(order)
