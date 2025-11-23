from django.contrib import admin
from .models import Book, BookBookmark


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'genre',
                    'available_copies', 'get_added_by_name', 'created_at')
    list_filter = ('genre', 'created_at', 'added_by')
    search_fields = ('title', 'author', 'description')
    ordering = ('-created_at',)

    def get_added_by_name(self, obj):
        if obj.added_by:
            try:
                return obj.added_by.librarian.name
            except:
                return obj.added_by.email
        return "Unknown"
    get_added_by_name.short_description = 'Added By'

    fieldsets = (
        ('Book Information', {
            'fields': ('title', 'author', 'genre', 'description', 'picture')
        }),
        ('Inventory', {
            'fields': ('available_copies',)
        }),
        ('Metadata', {
            'fields': ('added_by',)
        }),
    )


@admin.register(BookBookmark)
class BookBookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'book__title')
    ordering = ('-created_at',)
