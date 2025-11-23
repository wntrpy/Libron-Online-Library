from rest_framework import serializers
from .models import Book, BookBookmark


class BookSerializer(serializers.ModelSerializer):
    is_bookmarked = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    added_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'genre', 'description',
            'available_copies', 'picture', 'picture_url',
            'cover_image', 'is_bookmarked', 'added_by', 'added_by_name', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'added_by': {'required': False, 'allow_null': True}
        }

    def get_is_bookmarked(self, obj):
        # Will be handled client-side
        return False

    def get_cover_image(self, obj):
        """
        Single field for consumers to use when displaying book covers.
        Prioritizes uploaded image, otherwise falls back to picture_url.
        """
        request = self.context.get('request')

        if obj.picture:
            url = obj.picture.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url

        return obj.picture_url

    def get_added_by_name(self, obj):
        """Return the full name of the librarian who added the book."""
        if obj.added_by:
            try:
                return obj.added_by.librarian.name
            except:
                return obj.added_by.email
        return "Unknown"


class BookBookmarkSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = BookBookmark
        fields = ['id', 'book', 'created_at']
