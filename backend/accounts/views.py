from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from accounts.serializers import MemberRegistrationSerializer
from members.models import Member

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    print(f"Login attempt - Email: {email}")  # Debug

    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Find user by email
        user = User.objects.get(email=email)

        # Check password
        if user.check_password(password):
            response_data = {
                'id': user.id,
                'email': user.email,
                'user_type': user.user_type,
            }

            # If user is a member, include member details
            if user.user_type == 'member':
                try:
                    member = user.member
                    response_data.update({
                        'member_id': member.id,
                        'username': email,
                        'first_name': member.first_name,
                        'last_name': member.last_name,
                        'student_number': member.student_number,
                        'college': member.college,
                        'address': member.address,
                        'phone': member.phone,
                        'date_joined': member.date_joined,
                    })
                except:
                    pass

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Invalid password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Login error: {str(e)}")  # Debug
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_view(request):
    """Reset password for members by email."""
    email = request.data.get('email')

    if not email:
        return Response(
            {'error': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'error': 'Member with this email does not exist'},
            status=status.HTTP_404_NOT_FOUND
        )

    if user.user_type != 'member':
        return Response(
            {'error': 'Only members can reset their password here'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        member: Member = user.member
    except Member.DoesNotExist:
        return Response(
            {'error': 'Member profile not found for this user'},
            status=status.HTTP_404_NOT_FOUND
        )

    new_password = get_random_string(length=10)
    user.set_password(new_password)
    user.save()

    subject = 'Libron Library Password Reset'
    message = (
        f"Hello {member.first_name},\n\n"
        f"A new password has been generated for your Libron account.\n"
        f"New password: {new_password}\n\n"
        "Please log in using this password and change it immediately from your account settings.\n\n"
        "If you did not request this change, contact the library staff right away."
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@libron.local'),
        recipient_list=[email],
        fail_silently=False,
    )

    return Response(
        {'message': 'A new password has been sent to your email address.'},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new member"""
    serializer = MemberRegistrationSerializer(data=request.data)

    if serializer.is_valid():
        try:
            member = serializer.save()
            return Response(
                {
                    'message': 'Member registered successfully',
                    'member_id': member.id,
                    'email': member.user.email,
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    else:
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
