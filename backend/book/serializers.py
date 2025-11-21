from rest_framework import serializers
from .models import Book, BookBookmark


class BookSerializer(serializers.ModelSerializer):
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'genre', 'description',
            'available_copies', 'total_copies', 'picture_url',
            'is_bookmarked', 'created_at', 'updated_at'
        ]

    def get_is_bookmarked(self, obj):
        # Will be handled client-side
        return False


class BookBookmarkSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = BookBookmark
        fields = ['id', 'book', 'created_at']
