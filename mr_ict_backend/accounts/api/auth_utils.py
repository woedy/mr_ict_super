"""Utility helpers for issuing JWT tokens across account endpoints."""
from __future__ import annotations

from typing import Dict

from rest_framework_simplejwt.tokens import RefreshToken


def issue_tokens_for_user(user) -> Dict[str, str]:
    """Return a consistent token payload for the given user.

    The access token is duplicated under the legacy `token` key so that
    existing consumers that still read `data.token` continue to function
    while the apps migrate to the standard `Authorization: Bearer` header.
    """

    refresh = RefreshToken.for_user(user)
    user_id = getattr(user, "user_id", None) or getattr(user, "pk", None)
    refresh["user_id"] = user_id
    access_token = refresh.access_token
    access_token["user_id"] = user_id

    access = str(access_token)
    return {
        "access": access,
        "refresh": str(refresh),
        "token": access,
        "token_type": "Bearer",
    }
