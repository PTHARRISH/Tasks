import re

from django.contrib.auth.models import User
from rest_framework import serializers

from .models import FileUpload, Todo, UploadedImage

class UserDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "is_active"]


class SignupSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "confirm_password"]

    def validate(self, data):
        if User.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError("Username already exists.")
        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError("Email already exists.")
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")
        if not re.match(r"^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$", data["password"]):
            raise serializers.ValidationError(
                "Password must be alphanumeric and include a symbol."
            )
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create_user(**validated_data)
        return user


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = "__all__"


class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = "__all__"


class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = "__all__"
