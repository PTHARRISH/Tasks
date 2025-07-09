from django.db import models


class Todo(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()


class FileUpload(models.Model):
    file = models.FileField(upload_to="uploads/")
    uploaded_at = models.DateTimeField(auto_now_add=True)


class UploadedImage(models.Model):
    image = models.ImageField(upload_to="images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
