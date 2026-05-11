from __future__ import annotations

from uuid import uuid4

from app.domain.repositories import CartRepository, OrderRepository, ProductRepository


class ShopService:
    def __init__(
        self,
        product_repository: ProductRepository,
        cart_repository: CartRepository,
        order_repository: OrderRepository,
    ) -> None:
        self.product_repository = product_repository
        self.cart_repository = cart_repository
        self.order_repository = order_repository

    def list_products(self):
        return self.product_repository.list_products()

    def get_cart(self, user_id: str):
        return self.cart_repository.get_cart(user_id).items

    def add_to_cart(self, user_id: str, product_id: str, quantity: int = 1) -> None:
        product = self.product_repository.get_by_id(product_id)
        if product is None:
            raise ValueError("Product does not exist")

        cart = self.cart_repository.get_cart(user_id)
        cart.add_product(product, quantity)

        self.cart_repository.save_cart(user_id, cart)

    def remove_from_cart(self, user_id: str, product_id: str) -> None:
        cart = self.cart_repository.get_cart(user_id)
        cart.remove_one(product_id)

        self.cart_repository.save_cart(user_id, cart)

    def list_orders(self, user_id: str):
        return self.order_repository.list_orders(user_id)

    def get_order(self, order_id: str):
        return self.order_repository.get_order(order_id)

    def checkout(self, user_id: str) -> str | None:
        cart = self.cart_repository.get_cart(user_id)
        if cart.is_empty:
            return None

        order_id = str(uuid4())
        order = cart.checkout(user_id, order_id, self.product_repository.list_products())

        self.order_repository.add_order(order)
        cart.clear()
        self.cart_repository.save_cart(user_id, cart)
        return order_id
