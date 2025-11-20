from django.db import models
from accounts.models import User


class Member(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    student_number = models.IntegerField()
    name = models.CharField(max_length=255)
    college = models.CharField(max_length=255)
    address = models.TextField()

    def __str__(self):
        return self.name
