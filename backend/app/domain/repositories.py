from __future__ import annotations

from abc import ABC, abstractmethod

from .entities import CartItem, Order, Product


class ProductRepository(ABC):
    @abstractmethod
    def list_products(self) -> list[Product]:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, product_id: str) -> Product | None:
        raise NotImplementedError


class CartRepository(ABC):
    @abstractmethod
    def get_cart(self, user_id: str) -> list[CartItem]:
        raise NotImplementedError

    @abstractmethod
    def save_cart(self, user_id: str, cart: list[CartItem]) -> None:
        raise NotImplementedError


class OrderRepository(ABC):
    @abstractmethod
    def list_orders(self, user_id: str) -> list[Order]:
        raise NotImplementedError

    @abstractmethod
    def add_order(self, order: Order) -> None:
        raise NotImplementedError
