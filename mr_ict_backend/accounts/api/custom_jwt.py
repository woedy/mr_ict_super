from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView as BaseTokenRefreshView,
    TokenVerifyView as BaseTokenVerifyView,
)

User = get_user_model()


class CustomJWTAuthentication(JWTAuthentication):
    """Override user lookup so our custom `user_id` claim is honoured."""

    def get_user(self, validated_token):
        user_id = validated_token["user_id"]
        return User.objects.get(user_id=user_id)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = RefreshToken.for_user(user)
        token["user_id"] = getattr(user, "user_id", user.pk)
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(BaseTokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            token = RefreshToken(request.data.get("refresh"))
            access_token = str(token.access_token)
            return Response({"access": access_token}, status=status.HTTP_200_OK)
        except Exception as exc:  # pragma: no cover - defensive logging path
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenVerifyView(BaseTokenVerifyView):
    def post(self, request, *args, **kwargs):
        try:
            token = request.data.get("token")
            token_obj = RefreshToken(token)
            token_obj.verify()
            return Response({"message": "Token is valid"}, status=status.HTTP_200_OK)
        except Exception as exc:  # pragma: no cover - defensive logging path
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
