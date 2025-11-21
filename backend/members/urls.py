from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import MemberViewSet, get_member_by_email, update_member

router = DefaultRouter()
router.register(r'members', MemberViewSet)

urlpatterns = [
    path('member/email/<str:email>/',
         get_member_by_email, name='get-member-by-email'),
    path('member/<int:pk>/update/', update_member, name='update-member'),
] + router.urls
