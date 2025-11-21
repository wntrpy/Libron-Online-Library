from django.contrib import admin
from django.urls import path, include
from django.conf import settings  # ← ADD THIS LINE
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/members/', include('members.urls')),
    path('api/book/', include('book.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
