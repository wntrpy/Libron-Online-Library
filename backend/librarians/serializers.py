from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Librarian

User = get_user_model()

class LibrarianSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Librarian
        fields = ['id', 'librarian_id', 'name', 'contact_number', 'email']

class LibrarianCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(max_length=255)
    contact_number = serializers.CharField(max_length=20)
    librarian_id = serializers.CharField(max_length=50, required=False)
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def create(self, validated_data):
        try:
            user = User.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password'],
                user_type='librarian'
            )
            
            librarian = Librarian.objects.create(
                user=user,
                librarian_id=validated_data.get('librarian_id', f'LIB{user.id:04d}'),
                name=validated_data['name'],
                contact_number=validated_data['contact_number']
            )
            
            return librarian
        except Exception as e:
            if 'user' in locals() and hasattr(user, 'id') and user.id:
                user.delete()
            raise serializers.ValidationError(f"Failed to create librarian: {str(e)}")