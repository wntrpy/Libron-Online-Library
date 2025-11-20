from django.db import models
from accounts.models import User


class Librarian(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    librarian_id = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=20)
