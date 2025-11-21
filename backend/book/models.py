from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Book(models.Model):
    GENRE_CHOICES = [
        ('science_fiction', 'Science Fiction'),
        ('fantasy', 'Fantasy'),
        ('horror', 'Horror'),
        ('romance', 'Romance'),
    ]

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    genre = models.CharField(
        max_length=50, choices=GENRE_CHOICES, default='fantasy')
    description = models.TextField(blank=True, null=True)
    available_copies = models.IntegerField(default=0)

    # Support both file upload and URL
    picture = models.ImageField(
        upload_to='book_covers/', blank=True, null=True)
    picture_url = models.URLField(max_length=500, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def get_picture_url(self):
        """Return picture URL, prioritizing uploaded file over URL"""
        if self.picture:
            return self.picture.url
        return self.picture_url


class BookBookmark(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='bookmarks')
    book = models.ForeignKey(
        Book, on_delete=models.CASCADE, related_name='bookmarked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"
