from __future__ import annotations

import os
from collections import defaultdict

import psycopg
from psycopg.rows import dict_row

from app.domain.entities import Cart, Order, Product
from app.domain.repositories import CartRepository, OrderRepository, ProductRepository
from app.infrastructure.mappers import (
    to_cart,
    to_cart_item,
    to_cart_item_insert_rows,
    to_order,
    to_order_item_insert_rows,
    to_orders,
    to_product,
)

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

        return [to_product(row) for row in rows]

    def get_by_id(self, product_id: str) -> Product | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT id, name, price FROM products WHERE id = %s",
                (product_id,),
            ).fetchone()

        if row is None:
            return None

        return to_product(row)


class PostgreSQLCartRepository(PostgreSQLConnectionMixin, CartRepository):
    def get_cart(self, user_id: str) -> Cart:
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

        return to_cart(rows)

    def save_cart(self, user_id: str, cart: Cart) -> None:
        with self._connect() as connection:
            with connection.transaction():
                connection.execute(
                    "DELETE FROM cart_items WHERE user_id = %s",
                    (user_id,),
                )
                cart_rows = to_cart_item_insert_rows(user_id, cart)
                if cart_rows:
                    with connection.cursor() as cursor:
                        cursor.executemany(
                            """
                            INSERT INTO cart_items (user_id, product_id, quantity)
                            VALUES (%s, %s, %s)
                            """,
                            cart_rows,
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

        return to_orders(order_rows, item_rows)

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

        return to_order(row, [to_cart_item(item) for item in item_rows])

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
                        to_order_item_insert_rows(order),
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
        self._carts: dict[str, Cart] = defaultdict(Cart)

    def get_cart(self, user_id: str) -> Cart:
        return self._carts[user_id]

    def save_cart(self, user_id: str, cart: Cart) -> None:
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
