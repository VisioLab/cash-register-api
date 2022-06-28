from typing import Literal
from fastapi import FastAPI, status
from pydantic import BaseModel


class Message(BaseModel):
    """Message for additional information."""

    message: str


class Item(BaseModel):
    """Item for sale."""

    id: str
    price_lookup: str


class PricedItem(BaseModel):
    """Item with price."""

    price_lookup: str
    price: float


class Basket(BaseModel):
    """Basket of a single sale."""

    items: list[Item]


class Assortment(BaseModel):
    """Items available for sale."""

    items: list[PricedItem]


class PaymentWithStatus(Message):
    """Payment in progress."""

    status: Literal["pending", "cancelled", "failed"]


class SuccessfulPayment(Message):
    """Successful payment."""

    status: Literal["successful"]
    total_amount: float
    items: list[PricedItem]


Payment = PaymentWithStatus | SuccessfulPayment

app = FastAPI(
    title="VisioLab Cash Register API",
    description="We assume that we are connected to the cash register in the local network.",
)


@app.get(
    "/items",
    tags=["items"],
    summary="Get available items.",
    responses={
        200: {"model": Assortment, "description": "List of available items."},
    },
)
async def get_items():
    """Get items available in cash register to synchronize prices."""
    return


@app.put(
    "/baskets/current",
    summary="Set items in current basket.",
    tags=["baskets"],
    responses={
        200: {"model": Message, "description": "Items added to basket"},
        404: {"model": Message, "description": "Unknown PLU"},
        402: {"model": Message, "description": "Payment already in progress"},
    },
)
async def set_current_basket(
    basket: Basket,
):
    """Update the contents of the current basket.

    The contents of the basket are completely replaced by the new contents."""
    return


@app.post(
    "/payments",
    summary="Start payment for current basket.",
    tags=["payments"],
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"model": Message, "description": "Payment initiated."},
        400: {"model": Message, "description": "No items in basket."},
    },
)
async def start_payment(payment: Payment):
    """Initialize a payment for the current basket."""
    return


@app.get(
    "/payments/current",
    summary="Get status of current payment.",
    tags=["payments"],
    responses={
        200: {"model": Payment, "description": "Payment initiated"},
        404: {"model": Message, "description": "No payment in progress"},
        408: {"model": Message, "description": "Payment timed out"},
    },
)
async def get_payment_status():
    """Get status for the current payment."""
    return
