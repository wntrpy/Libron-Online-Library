from django.contrib import admin
from borrow.models import BorrowRequest


@admin.register(BorrowRequest)
class BorrowRequestAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'book',
        'get_member_name',
        'get_member_student_number',
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
    
    def get_member_name(self, obj):
        if obj.member:
            return f"{obj.member.first_name} {obj.member.last_name}"
        return "-"
    get_member_name.short_description = 'Member'
    get_member_name.admin_order_field = 'member__first_name'
    
    def get_member_student_number(self, obj):
        return obj.member.student_number if obj.member else "-"
    get_member_student_number.short_description = 'Student Number'
    get_member_student_number.admin_order_field = 'member__student_number'

