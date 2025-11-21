from datetime import date
from django.utils import timezone
from rest_framework import serializers
from book.serializers import BookSerializer
from borrow.models import BorrowRequest
from members.models import Member
from librarians.models import Librarian


class MemberSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'student_number', 'first_name', 'last_name']


class LibrarianSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Librarian
        fields = ['id', 'librarian_id', 'name']


class BorrowRequestSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    member = MemberSummarySerializer(read_only=True)
    librarian = LibrarianSummarySerializer(read_only=True)

    book_id = serializers.PrimaryKeyRelatedField(
        queryset=BookSerializer.Meta.model.objects.all(),
        write_only=True,
        source='book',
    )
    member_id = serializers.PrimaryKeyRelatedField(
        queryset=Member.objects.all(),
        write_only=True,
        source='member',
    )
    librarian_id = serializers.PrimaryKeyRelatedField(
        queryset=Librarian.objects.all(),
        write_only=True,
        allow_null=True,
        required=False,
        source='librarian',
    )

    due_in_days = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = BorrowRequest
        fields = [
            'id',
            'book',
            'member',
            'librarian',
            'book_id',
            'member_id',
            'librarian_id',
            'status',
            'status_display',
            'date_borrowed',
            'due_date',
            'due_in_days',
            'requested_at',
            'updated_at',
            'returned_at',
        ]
        read_only_fields = [
            'id',
            'book',
            'member',
            'librarian',
            'requested_at',
            'updated_at',
            'returned_at',
        ]

    def validate(self, attrs):
        status_value = attrs.get('status', getattr(self.instance, 'status', None))

        if status_value == BorrowRequest.Status.APPROVED:
            if not attrs.get('due_date') and not getattr(self.instance, 'due_date', None):
                raise serializers.ValidationError(
                    {'due_date': 'Due date is required when approving a request.'}
                )
        
        # Check borrow limit for new borrow requests
        if not self.instance:  # Only check for new borrow requests
            member = attrs.get('member')
            if not member and 'request' in self.context:
                member = self.context['request'].user.member
            if member:
                active_borrows = BorrowRequest.get_active_borrows_count(member.id)
                if active_borrows >= 5:
                    raise serializers.ValidationError(
                        {'non_field_errors': ['You have reached the maximum limit of 5 active borrows.']}
                    )

        return attrs

    def create(self, validated_data):
        validated_data.setdefault('status', BorrowRequest.Status.PENDING)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        status_value = validated_data.get('status')

        if status_value == BorrowRequest.Status.APPROVED:
            validated_data.setdefault('date_borrowed', date.today())

        if status_value == BorrowRequest.Status.RETURNED:
            validated_data['returned_at'] = timezone.now()

        return super().update(instance, validated_data)

    def get_due_in_days(self, obj):
        if obj.due_date and obj.date_borrowed:
            return (obj.due_date - obj.date_borrowed).days
        return None


