import re

import requests
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import filters, generics, viewsets
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import FileUpload, Todo, UploadedImage
from .serializers import (
    FileUploadSerializer,
    ImageUploadSerializer,
    SignupSerializer,
    TodoSerializer,
    UserDashboardSerializer,
)


class TodoListViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "description"]


@api_view(["GET"])
def ifsc_code_check(request, ifsc_code):
    # Validate length and pattern
    if not re.match(r"^[A-Z]{4}0[A-Z0-9]{6}$", ifsc_code):
        return Response(
            {
                "error": (
                    "Invalid IFSC code format. It must be 11 characters long:"
                    "- First 4 letters: Bank code (A-Z)"
                    "- 5th character: 0 (zero)"
                    "- Last 6: Branch code (alphanumeric)"
                )
            },
            status=400,
        )

    # Fetch IFSC details from Razorpay API
    url = f"https://ifsc.razorpay.com/{ifsc_code}"
    response = requests.get(url)

    if response.status_code == 200:
        return Response(response.json())

    return Response({"error": "Invalid IFSC code or not found"}, status=404)


@api_view(["GET", "POST", "DELETE"])
def cookie_view(request):
    if request.method == "POST":
        key = request.data.get("key")
        value = request.data.get("value")
        if not key or not value:
            return Response({"error": "Key and Value are required"}, status=400)
        response = Response({"message": "Cookie Set"})
        response.set_cookie(key, value)
        return response

    elif request.method == "DELETE":
        key = request.data.get("key")
        response = Response({"message": "Cookie Deleted"})
        response.delete_cookie(key)
        return response

    # GET
    cookies = request.COOKIES
    return Response({"cookies": cookies})


class FileUploadViewSet(viewsets.ModelViewSet):
    queryset = FileUpload.objects.all().order_by("-uploaded_at")
    serializer_class = FileUploadSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["file"]


class ImageUploadViewSet(viewsets.ModelViewSet):
    queryset = UploadedImage.objects.all().order_by("-uploaded_at")
    serializer_class = ImageUploadSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["image"]


class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid email or password."}, status=400)

        user = authenticate(username=user.username, password=password)
        if not user:
            return Response({"error": "Invalid email or password."}, status=400)

        return Response({"message": "Login successful", "username": user.username})


class DashboardUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserDashboardSerializer
    permission_classes = [IsAuthenticated]


class DashboardUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserDashboardSerializer
    permission_classes = [IsAuthenticated]
