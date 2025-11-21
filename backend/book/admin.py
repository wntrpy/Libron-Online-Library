from django.contrib import admin
from .models import Book, BookBookmark


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'genre',
                    'available_copies', 'total_copies', 'created_at')
    list_filter = ('genre', 'created_at')
    search_fields = ('title', 'author', 'description')
    ordering = ('-created_at',)

    fieldsets = (
        ('Book Information', {
            'fields': ('title', 'author', 'genre', 'description', 'picture')
        }),
        ('Inventory', {
            'fields': ('available_copies', 'total_copies')
        }),
    )


@admin.register(BookBookmark)
class BookBookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'book__title')
    ordering = ('-created_at',)
