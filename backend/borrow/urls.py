from django.urls import include, path
from rest_framework.routers import DefaultRouter
from borrow.views import BorrowRequestViewSet

router = DefaultRouter()
router.register(r'', BorrowRequestViewSet, basename='borrow-request')

urlpatterns = [
    path('', include(router.urls)),
]


