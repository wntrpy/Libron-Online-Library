from rest_framework import serializers
from members.models import Member
from accounts.models import User


class MemberSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = [
            'id', 'user', 'username', 'email', 'user_type',
            'student_number', 'first_name', 'last_name',
            'college', 'address', 'phone', 'date_joined'
        ]
        read_only_fields = ['id', 'user', 'date_joined', 'user_type']

    def get_username(self, obj):
        return obj.user.email

    def get_email(self, obj):
        return obj.user.email

    def get_user_type(self, obj):
        return obj.user.user_type
