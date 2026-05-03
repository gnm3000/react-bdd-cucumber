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


class OrderStatus(StrEnum):
    PAID = "paid"


@dataclass(frozen=True)
class Order:
    id: str
    user_id: str
    items: list[CartItem]
    total: int
    status: OrderStatus
