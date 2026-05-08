from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StrictInt, StringConstraints

ProductId = Annotated[
    str,
    StringConstraints(min_length=1, max_length=64, pattern=r"^[A-Za-z0-9_-]+$"),
]
PositiveQuantity = Annotated[StrictInt, Field(ge=1)]


class ProductResponse(BaseModel):
    id: ProductId
    name: str
    price: int


class CartItemResponse(BaseModel):
    product_id: ProductId
    quantity: PositiveQuantity


class AddToCartRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    product_id: ProductId
    quantity: PositiveQuantity = 1


class OrderResponse(BaseModel):
    id: str
    user_id: str
    items: list[CartItemResponse]
    total: int
    status: str
