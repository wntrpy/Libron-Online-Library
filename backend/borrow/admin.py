from django.contrib import admin
from borrow.models import BorrowRequest


@admin.register(BorrowRequest)
class BorrowRequestAdmin(admin.ModelAdmin):
    list_display = (
        'book',
        'member',
        'status',
        'date_borrowed',
        'due_date',
        'requested_at',
    )
    list_filter = ('status', 'requested_at', 'due_date')
    search_fields = (
        'book__title',
        'member__first_name',
        'member__last_name',
        'member__student_number',
    )
