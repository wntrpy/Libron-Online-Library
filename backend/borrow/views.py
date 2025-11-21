from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from borrow.models import BorrowRequest
from borrow.serializers import BorrowRequestSerializer


class BorrowRequestViewSet(viewsets.ModelViewSet):
    queryset = BorrowRequest.objects.select_related(
        'book',
        'member__user',
        'librarian__user',
    )
    serializer_class = BorrowRequestSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        request = self.request

        status_param = request.query_params.get('status')
        member_id = request.query_params.get('member_id')
        librarian_id = request.query_params.get('librarian_id')
        book_id = request.query_params.get('book_id')

        if status_param:
            statuses = [
                item.strip().lower()
                for item in status_param.split(',')
                if item.strip()
            ]
            queryset = queryset.filter(status__in=statuses)

        if member_id:
            queryset = queryset.filter(member_id=member_id)

        if librarian_id:
            queryset = queryset.filter(librarian_id=librarian_id)

        if book_id:
            queryset = queryset.filter(book_id=book_id)

        return queryset.order_by('-requested_at')
