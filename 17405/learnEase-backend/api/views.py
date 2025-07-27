from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserSignup
from .serializers import UserSignupSerializer

class UserSignupCreateView(generics.CreateAPIView):
    queryset = UserSignup.objects.all()
    serializer_class = UserSignupSerializer


@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = UserSignup.objects.get(email=email)
        if user.password == password:
            return Response({'success': True, 'message': 'Login successful'})
        else:
            return Response({'success': False, 'message': 'Invalid password'}, status=400)
    except UserSignup.DoesNotExist:
        return Response({'success': False, 'message': 'User not found'}, status=404)