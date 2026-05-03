from __future__ import annotations

from pydantic import BaseModel


class ProductResponse(BaseModel):
    id: str
    name: str
    price: int


class CartItemResponse(BaseModel):
    product_id: str
    quantity: int


class AddToCartRequest(BaseModel):
    product_id: str
    quantity: int = 1


class OrderResponse(BaseModel):
    id: str
    user_id: str
    items: list[CartItemResponse]
    total: int
    status: str
