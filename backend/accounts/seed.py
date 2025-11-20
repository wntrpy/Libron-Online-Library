from accounts.models import User
from members.models import Member
from librarians.models import Librarian
from admins.models import Admin


def run():
    # Member
    m_user = User.objects.create_user(
        email="member@gmail.com",
        password="member123",
        user_type="member"
    )
    Member.objects.create(
        user=m_user,
        student_number=12345,
        name="John Student",
        college="CCS",
        address="Sample Address"
    )

    # Librarian
    l_user = User.objects.create_user(
        email="librarian@gmail.com",
        password="lib123",
        user_type="librarian"
    )
    Librarian.objects.create(
        user=l_user,
        librarian_id="LIB001",
        name="Maria Librarian",
        contact_number="09123456789"
    )

    # Admin
    a_user = User.objects.create_user(
        email="admin@gmail.com",
        password="admin123",
        user_type="admin"
    )
    Admin.objects.create(
        user=a_user,
        admin_id="ADM001",
        name="Bruce Admin",
        contact_number="09991231234"
    )
