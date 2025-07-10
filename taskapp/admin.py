from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from .models import FileUpload, Todo, UploadedImage


class TodoResource(resources.ModelResource):
    class Meta:
        model = Todo
        fields = ("id", "name", "description")


class FileUploadResource(resources.ModelResource):
    class Meta:
        model = FileUpload
        fields = ("id", "file", "uploaded_at")


class UploadedImageResource(resources.ModelResource):
    class Meta:
        model = UploadedImage
        fields = ("id", "image", "uploaded_at")


@admin.register(Todo)
class TodoAdmin(ImportExportModelAdmin):
    resource_class = TodoResource
    list_display = ("id", "name", "description")
    search_fields = ("name",)


@admin.register(FileUpload)
class FileUploadAdmin(ImportExportModelAdmin):
    resource_class = FileUploadResource
    list_display = ("id", "file", "uploaded_at")
    readonly_fields = ("uploaded_at",)


@admin.register(UploadedImage)
class UploadedImageAdmin(ImportExportModelAdmin):
    resource_class = UploadedImageResource
    list_display = ("id", "image", "uploaded_at")
    readonly_fields = ("uploaded_at",)
