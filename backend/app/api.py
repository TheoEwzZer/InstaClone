"""
This file contains the API endpoints for the instaclone application.
"""

import re
from typing import Any, Dict, List, Tuple

import bcrypt
from app.config.db import get_db
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mysql.connector.connection import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from mysql.connector.pooling import PooledMySQLConnection
from validate_email import validate_email

from app.auth.auth import decode_jwt, encode_jwt

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
    cursor: Any | MySQLCursor = db.cursor()
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
async def register_user(user: Dict[str, str]) -> Dict[str, str]:
    cursor: Any | MySQLCursor = db.cursor()
    mobile: str | None = user["mobile"] or None
    email: str | None = user["email"] or None

    password: str = user["password"]
    password_bytes: bytes = password.encode(encoding="utf-8")
    salt: bytes = bcrypt.gensalt()
    hashed_password: bytes = bcrypt.hashpw(password=password_bytes, salt=salt)

    params: Tuple[str | None, str | None, str, str, bytes, str] = (
        mobile,
        email,
        user["fullName"],
        user["username"],
        hashed_password,
        user["birthday"]
    )
    operation = "INSERT INTO user (mobile, email, fullName, username, password, birthday) VALUES (%s, %s, %s, %s, %s, %s)"
    cursor.execute(operation, params)
    db.commit()
    return encode_jwt(username=user["username"])


@app.post(path="/login", tags=["users"], status_code=200)
async def login_user(user: Dict[str, str]) -> Dict[str, str]:
    error_message = "Sorry, your password was incorrect. Please double-check your password."
    cursor: Any | MySQLCursor = db.cursor()
    if user["email"]:
        cursor.execute(
            operation="SELECT * FROM user WHERE email = %s", params=(user["email"],)
        )
    if user["mobile"]:
        cursor.execute(
            operation="SELECT * FROM user WHERE mobile = %s", params=(user["mobile"],)
        )
    if user["username"]:
        cursor.execute(
            operation="SELECT * FROM user WHERE username = %s", params=(user["username"],)
        )
    result: Any | Tuple[str | bytes | None, ...] | None = cursor.fetchone()
    if result is None:
        raise HTTPException(status_code=404, detail=error_message)
    hashed_password_first: str = str(object=result[5])
    hashed_password: bytes = hashed_password_first.encode(encoding="utf-8")
    password: bytes = user["password"].encode(encoding="utf-8")
    if not bcrypt.checkpw(password=password, hashed_password=hashed_password):
        raise HTTPException(status_code=404, detail=error_message)
    return encode_jwt(username=user["username"])


@app.delete(path="/users/delete/email/{email}", tags=["users"], status_code=200)
async def delete_user_by_email(email: str) -> Dict[str, str]:
    cursor: Any | MySQLCursor = db.cursor()
    cursor.execute(
        operation="DELETE FROM user WHERE email = %s", params=(email,)
    )
    if not cursor.rowcount:
        raise HTTPException(
            status_code=404, detail="Not found")
    db.commit()
    return {"message": f"Successfully deleted user with email {email}."}


@app.get(path="/check_token", tags=["users"], status_code=200, dependencies=[Depends(dependency=decode_jwt)])
async def check_token() -> Dict[str, str]:
    return {"message": "Token is valid"}
