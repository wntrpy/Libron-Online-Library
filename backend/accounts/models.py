# backend/accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USER_TYPES = (
        ('member', 'Member'),
        ('librarian', 'Librarian'),
        ('admin', 'Admin'),
    )

    user_type = models.CharField(max_length=20, choices=USER_TYPES)
    email = models.EmailField(unique=True)

    username = None  # remove default username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
