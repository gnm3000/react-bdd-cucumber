from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, BeforeValidator, ConfigDict, Field, StringConstraints

ProductId = Annotated[
    str,
    StringConstraints(min_length=1, max_length=64, pattern=r"^[A-Za-z0-9_-]+$"),
]

def reject_json_non_integer(value: object) -> object:
    if isinstance(value, bool | str):
        raise ValueError("Quantity must be a JSON integer")

    return value


PositiveQuantity = Annotated[int, Field(ge=1), BeforeValidator(reject_json_non_integer)]


class ProductResponse(BaseModel):
    id: ProductId
    name: str
    price: int


class CartItemResponse(BaseModel):
    product_id: ProductId
    quantity: PositiveQuantity


class AddToCartRequest(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={"examples": [{"product_id": "p1", "quantity": 1}]},
    )

    product_id: ProductId
    quantity: PositiveQuantity = 1


class OrderResponse(BaseModel):
    id: str
    user_id: str
    items: list[CartItemResponse]
    total: int
    status: str
