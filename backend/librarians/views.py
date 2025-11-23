# backend/librarians/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .models import Librarian
from .serializers import LibrarianSerializer, LibrarianCreateSerializer

User = get_user_model()

class LibrarianViewSet(viewsets.ModelViewSet):
    queryset = Librarian.objects.all()
    serializer_class = LibrarianSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return LibrarianCreateSerializer
        return LibrarianSerializer
    
    def list(self, request):
        """Get all librarians"""
        librarians = self.queryset.all()
        serializer = LibrarianSerializer(librarians, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        """Create new librarian"""
        serializer = LibrarianCreateSerializer(data=request.data)
        if serializer.is_valid():
            librarian = serializer.save()
            return Response(
                LibrarianSerializer(librarian).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        """Delete librarian"""
        try:
            librarian = Librarian.objects.get(pk=pk)
            user = librarian.user
            librarian.delete()
            user.delete()  # Also delete the associated user
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Librarian.DoesNotExist:
            return Response(
                {'error': 'Librarian not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
    @action(detail=True, methods=['post'], url_path='reset-password')
    def reset_password(self, request, pk=None):
        """Reset librarian password"""
        try:
            librarian = Librarian.objects.get(pk=pk)
            new_password = request.data.get('new_password')
            
            if not new_password:
                return Response(
                    {'error': 'New password is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if len(new_password) < 8:
                return Response(
                    {'error': 'Password must be at least 8 characters long'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set the new password
            user = librarian.user
            user.set_password(new_password)
            user.save()
            
            return Response(
                {'message': 'Password reset successfully'},
                status=status.HTTP_200_OK
            )
        except Librarian.DoesNotExist:
            return Response(
                {'error': 'Librarian not found'},
                status=status.HTTP_404_NOT_FOUND
            )