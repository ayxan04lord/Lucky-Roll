from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Profile


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=400)
    if len(password) < 6:
        return Response({'error': 'Password must be at least 6 characters.'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken.'}, status=400)

    user = User.objects.create_user(username=username, password=password)
    Profile.objects.create(user=user, coins=1000)  # welcome bonus
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'username': user.username}, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid username or password.'}, status=401)
    Profile.objects.get_or_create(user=user)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'username': user.username})


@api_view(['POST'])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out.'})


@api_view(['GET'])
def me(request):
    from .models import Profile
    from .serializers import ProfileSerializer
    profile, _ = Profile.objects.get_or_create(user=request.user)
    return Response({
        'username': request.user.username,
        'id': request.user.id,
        'coins': profile.coins,
    })
