from __future__ import annotations

from uuid import uuid4

from app.domain.entities import CartItem, Order, OrderStatus
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
        return self.cart_repository.get_cart(user_id)

    def add_to_cart(self, user_id: str, product_id: str, quantity: int = 1) -> None:
        product = self.product_repository.get_by_id(product_id)
        if product is None:
            raise ValueError("Product does not exist")

        cart = self.cart_repository.get_cart(user_id)
        existing = next((item for item in cart if item.product_id == product_id), None)
        if existing:
            existing.quantity += quantity
        else:
            cart.append(CartItem(product_id=product_id, quantity=quantity))

        self.cart_repository.save_cart(user_id, cart)

    def remove_from_cart(self, user_id: str, product_id: str) -> None:
        cart = self.cart_repository.get_cart(user_id)
        updated_cart: list[CartItem] = []
        for item in cart:
            if item.product_id != product_id:
                updated_cart.append(item)
                continue

            next_quantity = item.quantity - 1
            if next_quantity > 0:
                updated_cart.append(
                    CartItem(product_id=item.product_id, quantity=next_quantity)
                )

        self.cart_repository.save_cart(user_id, updated_cart)

    def list_orders(self, user_id: str):
        return self.order_repository.list_orders(user_id)

    def get_order(self, order_id: str):
        return self.order_repository.get_order(order_id)

    def checkout(self, user_id: str) -> str | None:
        cart = self.cart_repository.get_cart(user_id)
        if not cart:
            return None

        products_by_id = {
            product.id: product for product in self.product_repository.list_products()
        }
        total = sum(
            products_by_id[item.product_id].price * item.quantity for item in cart
        )
        order_id = str(uuid4())

        order = Order(
            id=order_id,
            user_id=user_id,
            items=[
                CartItem(product_id=item.product_id, quantity=item.quantity)
                for item in cart
            ],
            total=total,
            status=OrderStatus.PAID,
        )
        self.order_repository.add_order(order)
        self.cart_repository.save_cart(user_id, [])
        return order_id
