from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from members.models import Member
from members.serializers import MemberSerializer


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['post'], url_path='reset-password')
    def reset_password(self, request, pk=None):
        """Reset password for a member"""
        try:
            member = self.get_object()
            new_password = request.data.get('new_password')
            
            if not new_password:
                return Response(
                    {'error': 'New password is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if len(new_password) < 8:
                return Response(
                    {'error': 'Password must be at least 8 characters'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            member.user.set_password(new_password)
            member.user.save()
            
            return Response(
                {'message': 'Password reset successfully'}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
@permission_classes([AllowAny])
def get_member_by_email(request, email):
    """Get member details by email"""
    try:
        member = Member.objects.get(user__email=email)
        serializer = MemberSerializer(member)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Member.DoesNotExist:
        return Response(
            {'error': 'Member not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT'])
@permission_classes([AllowAny])
def update_member(request, pk):
    """Update member details"""
    try:
        member = Member.objects.get(pk=pk)
        serializer = MemberSerializer(member, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Member.DoesNotExist:
        return Response(
            {'error': 'Member not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )