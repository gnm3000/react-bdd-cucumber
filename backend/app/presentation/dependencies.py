from __future__ import annotations

from functools import lru_cache

from app.application.services import ShopService
from app.infrastructure.repositories import (
    InMemoryCartRepository,
    InMemoryOrderRepository,
    InMemoryProductRepository,
)


@lru_cache
def get_shop_service() -> ShopService:
    return ShopService(
        product_repository=InMemoryProductRepository(),
        cart_repository=InMemoryCartRepository(),
        order_repository=InMemoryOrderRepository(),
    )
