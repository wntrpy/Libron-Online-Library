from django.db import models
from django.utils import timezone
from book.models import Book
from members.models import Member
from librarians.models import Librarian


class BorrowRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'
        RETURNED = 'returned', 'Returned'
        OVERDUE = 'overdue', 'Overdue'

    book = models.ForeignKey(
        Book,
        on_delete=models.PROTECT,
        related_name='borrow_requests',
    )
    member = models.ForeignKey(
        Member,
        on_delete=models.CASCADE,
        related_name='borrow_requests',
    )
    librarian = models.ForeignKey(
        Librarian,
        on_delete=models.SET_NULL,
        related_name='processed_borrow_requests',
        null=True,
        blank=True,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    date_borrowed = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    returned_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)

    requested_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-requested_at']

    def __str__(self):
        return f"{self.book.title} - {self.member} ({self.status})"

    def mark_returned(self):
        self.status = self.Status.RETURNED
        self.returned_at = timezone.now()
        self.save(update_fields=['status', 'returned_at', 'updated_at'])
