from rest_framework import serializers
from accounts.models import User
from members.models import Member
from django.utils import timezone


class MemberRegistrationSerializer(serializers.Serializer):
    """Serializer for member registration"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=255)
    last_name = serializers.CharField(max_length=255)
    student_number = serializers.IntegerField()
    college = serializers.CharField(max_length=255)
    address = serializers.CharField()
    phone = serializers.CharField(max_length=20)

    def validate(self, attrs):
        """Validate that passwords match"""
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )
        return attrs

    def validate_email(self, value):
        """Validate that email is unique"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "This email is already registered.")
        return value

    def validate_student_number(self, value):
        """Validate that student number is unique"""
        if Member.objects.filter(student_number=value).exists():
            raise serializers.ValidationError(
                "This student number is already registered.")
        return value

    def create(self, validated_data):
        """Create user and member"""
        # Remove confirm_password and date_joined from validated_data
        validated_data.pop('confirm_password')

        password = validated_data.pop('password')

        # Extract member-specific fields
        member_data = {
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
            'student_number': validated_data.pop('student_number'),
            'college': validated_data.pop('college'),
            'address': validated_data.pop('address'),
            'phone': validated_data.pop('phone'),
            'date_joined': timezone.now(),
        }

        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            password=password,
            user_type='member'
        )

        # Create member
        member = Member.objects.create(
            user=user,
            **member_data
        )

        return member
