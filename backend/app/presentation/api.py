from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from app.application.services import ShopService
from app.presentation.dependencies import get_shop_service
from app.presentation.schemas import (
    AddToCartRequest,
    CartItemResponse,
    ErrorResponse,
    OrderResponse,
    ProductId,
    ProductResponse,
)

router = APIRouter(prefix="/api", tags=["shop"])
DEFAULT_USER = "qa-demo-user"


@router.get("/products", response_model=list[ProductResponse])
def list_products(service: ShopService = Depends(get_shop_service)):
    return service.list_products()


@router.get("/cart", response_model=list[CartItemResponse])
def get_cart(service: ShopService = Depends(get_shop_service)):
    return service.get_cart(DEFAULT_USER)


@router.post(
    "/cart/items",
    response_model=list[CartItemResponse],
    responses={
        400: {
            "model": ErrorResponse,
            "description": "Malformed JSON request body",
        },
        404: {
            "model": ErrorResponse,
            "description": "Product does not exist",
        },
    },
)
def add_to_cart(
    request: AddToCartRequest, service: ShopService = Depends(get_shop_service)
):
    try:
        service.add_to_cart(DEFAULT_USER, request.product_id, request.quantity)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error

    return service.get_cart(DEFAULT_USER)


@router.delete("/cart/items/{product_id}", response_model=list[CartItemResponse])
def remove_from_cart(
    product_id: ProductId, service: ShopService = Depends(get_shop_service)
):
    service.remove_from_cart(DEFAULT_USER, product_id)
    return service.get_cart(DEFAULT_USER)


@router.get("/orders", response_model=list[OrderResponse])
def list_orders(service: ShopService = Depends(get_shop_service)):
    return service.list_orders(DEFAULT_USER)


@router.post("/orders/checkout", response_model=OrderResponse | None)
def checkout(service: ShopService = Depends(get_shop_service)):
    order_id = service.checkout(DEFAULT_USER)
    if order_id is None:
        return None

    return service.get_order(order_id)
