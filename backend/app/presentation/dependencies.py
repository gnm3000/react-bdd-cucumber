from __future__ import annotations

from functools import lru_cache

from app.application.services import ShopService
from app.infrastructure.repositories import (
    PostgreSQLCartRepository,
    PostgreSQLOrderRepository,
    PostgreSQLProductRepository,
)


@lru_cache
def get_shop_service() -> ShopService:
    return ShopService(
        product_repository=PostgreSQLProductRepository(),
        cart_repository=PostgreSQLCartRepository(),
        order_repository=PostgreSQLOrderRepository(),
    )
