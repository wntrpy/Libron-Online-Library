# yourapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LibrarianViewSet

router = DefaultRouter()
router.register(r'librarians', LibrarianViewSet, basename='librarian')

urlpatterns = [
    path('api/', include(router.urls)),
]