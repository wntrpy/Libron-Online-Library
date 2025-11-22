
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Book, BookBookmark
from .serializers import BookSerializer, BookBookmarkSerializer
from django.db import models


from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import mixins


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = Book.objects.all()
        genre = self.request.query_params.get('genre')
        search = self.request.query_params.get('search')
        if genre:
            queryset = queryset.filter(genre=genre.lower().replace(' ', '_'))
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(author__icontains=search)
            )
        return queryset

    @action(detail=False, methods=['get'])
    def popular(self, request):
        popular_books = self.get_queryset()[:4]
        serializer = self.get_serializer(popular_books, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def bookmark(self, request, pk=None):
        book = self.get_object()
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'User ID required'}, status=status.HTTP_400_BAD_REQUEST)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        bookmark, created = BookBookmark.objects.get_or_create(
            user=user, book=book)
        if not created:
            bookmark.delete()
            return Response({'bookmarked': False}, status=status.HTTP_200_OK)
        return Response({'bookmarked': True}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def my_bookmarks(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'User ID required'}, status=status.HTTP_400_BAD_REQUEST)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        bookmarks = BookBookmark.objects.filter(
            user=user).select_related('book')
        serializer = BookBookmarkSerializer(
            bookmarks, many=True, context=self.get_serializer_context())
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Override update to support editing all fields except id
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        data.pop('id', None)  # Prevent editing book id
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    # Override destroy to support book deletion
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            # Clear picture field to avoid file deletion errors
            if instance.picture:
                try:
                    instance.picture.delete(save=False)
                except Exception:
                    pass  # Ignore file deletion errors
                instance.picture = None
                instance.save(update_fields=["picture"])
            instance.delete()
            return Response({'detail': 'Book deleted successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'detail': f'Error deleting book: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Support image upload/delete via PATCH
    @action(detail=True, methods=['patch'], url_path='picture')
    def update_picture(self, request, pk=None):
        book = self.get_object()
        picture = request.FILES.get('picture')
        if picture:
            book.picture = picture
            book.save()
            return Response({'picture_url': book.get_picture_url()}, status=status.HTTP_200_OK)
        # If no file, delete picture
        book.picture.delete(save=True)
        return Response({'picture_url': None}, status=status.HTTP_200_OK)
