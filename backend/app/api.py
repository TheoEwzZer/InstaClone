"""
This file contains the API endpoints for the instaclone application.
"""

import re
from typing import Any, Dict, List, Tuple

from app.config.db import get_db
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mysql.connector.connection import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from mysql.connector.pooling import PooledMySQLConnection
from validate_email import validate_email

app = FastAPI()

ORIGINS: List[str] = ["http://localhost:3000", "localhost:3000"]

app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["DELETE", "POST", "GET", "PUT"],
    allow_headers=["*"],
)

db: PooledMySQLConnection | MySQLConnection | Any = get_db()


@app.post(path="/checkregister", tags=["users"], status_code=200)
async def check_register_user(user: Dict[str, str]) -> None:
    if (not user["email"]) and (not user["mobile"]):
        raise HTTPException(
            status_code=400, detail="Email or Mobile is required.")
    cursor: MySQLCursor = db.cursor()
    if user["email"]:
        if not validate_email(email=user["email"]):
            raise HTTPException(
                status_code=400, detail="Enter a valid email address.")
        cursor.execute(
            operation="SELECT * FROM user WHERE email = %s", params=(user["email"],)
        )
        if cursor.fetchone():
            raise HTTPException(
                status_code=409, detail="Another account is using the same email.")
    if user["mobile"]:
        if not re.match(pattern=r"^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$", string=user["mobile"]):
            raise HTTPException(
                status_code=400, detail="Looks like your phone number may be incorrect. Please try entering your full number, including the country code.")
        cursor.execute(
            operation="SELECT * FROM user WHERE mobile = %s", params=(user["mobile"],)
        )
        if cursor.fetchone():
            raise HTTPException(
                status_code=409, detail="Another account is using the same mobile.")
    cursor.execute(
        operation="SELECT * FROM user WHERE username = %s", params=(user["username"],)
    )
    if cursor.fetchone():
        raise HTTPException(
            status_code=409, detail="This username isn't available. Please try another.")


@app.post(path="/register", tags=["users"], status_code=201)
async def register_user(user: Dict[str, str]) -> None:
    cursor: MySQLCursor = db.cursor()
    mobile = user["mobile"] or None
    email = user["email"] or None
    params: Tuple[str, str, str, str, str, str] = (
        mobile,
        email,
        user["fullName"],
        user["username"],
        user["password"],
        user["birthday"]
    )
    operation = "INSERT INTO user (mobile, email, fullName, username, password, birthday) VALUES (%s, %s, %s, %s, %s, %s)"
    cursor.execute(operation, params)
    db.commit()


@app.post(path="/login", tags=["users"], status_code=200)
async def login_user(user: Dict[str, str]) -> None:
    cursor: MySQLCursor = db.cursor()
    if user["email"]:
        cursor.execute(
            operation="SELECT * FROM user WHERE email = %s AND password = %s", params=(user["email"], user["password"])
        )
    if user["mobile"]:
        cursor.execute(
            operation="SELECT * FROM user WHERE mobile = %s AND password = %s", params=(user["mobile"], user["password"])
        )
    if user["username"]:
        cursor.execute(
            operation="SELECT * FROM user WHERE username = %s AND password = %s", params=(user["username"], user["password"])
        )
    if not cursor.fetchone():
        error_message = "Sorry, your password was incorrect. Please double-check your password."
        raise HTTPException(
            status_code=404, detail=error_message)
