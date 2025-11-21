from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Book, BookBookmark
from .serializers import BookSerializer, BookBookmarkSerializer


class BookViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]  # No authentication needed

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular books (first 4 books)"""
        popular_books = self.queryset[:4]
        serializer = self.get_serializer(popular_books, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def bookmark(self, request, pk=None):
        """Toggle bookmark for a book"""
        book = self.get_object()
        user_id = request.data.get('user_id')

        if not user_id:
            return Response(
                {'error': 'User ID required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.contrib.auth import get_user_model
        User = get_user_model()

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        bookmark, created = BookBookmark.objects.get_or_create(
            user=user,
            book=book
        )

        if not created:
            bookmark.delete()
            return Response({'bookmarked': False}, status=status.HTTP_200_OK)

        return Response({'bookmarked': True}, status=status.HTTP_201_CREATED)
