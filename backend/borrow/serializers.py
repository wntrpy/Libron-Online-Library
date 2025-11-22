from datetime import date
from django.utils import timezone
from rest_framework import serializers
from book.serializers import BookSerializer
from borrow.models import BorrowRequest
from members.models import Member
from librarians.models import Librarian


class MemberSummarySerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Member
        fields = ['id', 'student_number', 'first_name', 'last_name', 'email']


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
        old_status = instance.status
        new_status = validated_data.get('status')

        # Handle status change to APPROVED
        if new_status == BorrowRequest.Status.APPROVED and old_status != BorrowRequest.Status.APPROVED:
            validated_data.setdefault('date_borrowed', date.today())
            
            # Set librarian if not already set and librarian_id is provided
            if 'librarian' in validated_data and validated_data['librarian']:
                instance.librarian = validated_data['librarian']
            
            # Decrease available copies
            book = instance.book
            if book.available_copies > 0:
                book.available_copies -= 1
                book.save(update_fields=['available_copies'])
            else:
                raise serializers.ValidationError(
                    {'non_field_errors': ['No available copies of this book.']}
                )

        # Handle status change to RETURNED or when returned_at is provided
        if (new_status == BorrowRequest.Status.RETURNED and old_status != BorrowRequest.Status.RETURNED) or \
           (new_status == BorrowRequest.Status.RETURNED and 'returned_at' in validated_data):
            
            # Set librarian if librarian_id is provided and not already set
            if 'librarian' in validated_data and validated_data['librarian'] and not instance.librarian:
                instance.librarian = validated_data['librarian']
            
            # Get the return date from validated_data or use current time
            returned_at = validated_data.get('returned_at')
            if not returned_at:
                returned_at = timezone.now()
                validated_data['returned_at'] = returned_at
            
            # Ensure returned_at is properly converted to datetime for saving
            if isinstance(returned_at, str):
                try:
                    returned_at = timezone.datetime.fromisoformat(returned_at.replace('Z', '+00:00'))
                    if timezone.is_naive(returned_at):
                        returned_at = timezone.make_aware(returned_at)
                    validated_data['returned_at'] = returned_at
                except ValueError:
                    pass  # Keep original value if parsing fails
            
            # Check if returned after due date - mark as overdue
            if instance.due_date:
                # Convert returned_at to date for comparison
                if hasattr(returned_at, 'date'):
                    return_date = returned_at.date()
                elif isinstance(returned_at, str):
                    try:
                        parsed_dt = timezone.datetime.fromisoformat(returned_at.replace('Z', '+00:00'))
                        return_date = parsed_dt.date()
                    except:
                        return_date = None
                else:
                    return_date = returned_at
                
                if return_date and return_date > instance.due_date:
                    validated_data['status'] = BorrowRequest.Status.OVERDUE
            
            # Increase available copies back only if this is the first time marking as returned/overdue
            if old_status not in [BorrowRequest.Status.RETURNED, BorrowRequest.Status.OVERDUE]:
                book = instance.book
                book.available_copies += 1
                book.save(update_fields=['available_copies'])

        return super().update(instance, validated_data)

    def get_due_in_days(self, obj):
        if obj.due_date and obj.date_borrowed:
            return (obj.due_date - obj.date_borrowed).days
        return None


