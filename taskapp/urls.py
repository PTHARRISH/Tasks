from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    DashboardUserDetailView,
    DashboardUserListView,
    FileUploadViewSet,
    ImageUploadViewSet,
    LoginView,
    SignupView,
    TodoListViewSet,
    ifsc_code_check,
)

router = DefaultRouter()
router.register("todo", TodoListViewSet)
router.register(r"file-upload", FileUploadViewSet, basename="file-upload")
router.register(r"image-upload", ImageUploadViewSet, basename="image-upload")

urlpatterns = [
    path("", include(router.urls)),
    path("ifsc/<str:ifsc_code>/", ifsc_code_check),
    # path("cookie/", cookie_view),
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("dashboard/", DashboardUserListView.as_view(), name="dashboard"),
    path(
        "dashboard/<int:pk>/",
        DashboardUserDetailView.as_view(),
        name="dashboard-detail",
    ),
]
