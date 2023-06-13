"""
This module contains functions for encoding and decoding JWT tokens, as well as extracting the username address from a token.

The following functions are available:

- encode_jwt(username: str) -> Dict[str, str]: Encodes a JWT token with the given username and expiration time.
- decode_jwt(token: str = Header(description="JWT authorization header")) -> Dict[str, str]: Decodes a JWT token and returns the decoded payload.

The module uses the following global variables:

- JWT_SECRET_KEY: The secret key used for encoding and decoding JWT tokens.
- JWT_ALGORITHM: The algorithm used for encoding and decoding JWT tokens.
"""

import os
from typing import Dict

import jwt
from dotenv import load_dotenv
from fastapi import Header, HTTPException

load_dotenv()
JWT_SECRET_KEY: str | None = os.getenv(key="SECRET")
JWT_ALGORITHM = "HS256"


def encode_jwt(username: str) -> Dict[str, str]:
    payload: dict[str, str] = {"username": username}
    token: str = jwt.encode(
        payload=payload, key=JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return {"token": token}


async def decode_jwt(token: str = Header(description="JWT authorization header")) -> Dict[str, str]:
    try:
        return jwt.decode(jwt=token, key=JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=401, detail="Token is not valid") from e
