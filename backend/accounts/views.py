from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login, logout
from django.contrib.auth.models import update_last_login
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer, UserProfileUpdateSerializer
from .models import User
import requests
import jwt
from django.conf import settings
from datetime import datetime

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def signup(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_auth(request):
    """
    Handle Google OAuth authentication with proper token verification
    """
    id_token = request.data.get('id_token')
    
    if not id_token:
        return Response({'error': 'ID token is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verify the Google ID token using Google's API
        response = requests.get(
            f'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={id_token}'
        )
        
        if response.status_code != 200:
            return Response({'error': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)
        
        token_info = response.json()
        
        # Verify the token is for our client
        client_id = '599251054902-9s286dlgrjg24fkkler7vdk873q9hgac.apps.googleusercontent.com'
        if token_info.get('aud') != client_id:
            return Response({'error': 'Token audience mismatch'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract user information
        email = token_info.get('email')
        name = token_info.get('name', '')
        google_id = token_info.get('sub')
        
        if not email:
            return Response({'error': 'Email is required from Google'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'full_name': name,
                'username': email.split('@')[0],
                'is_active': True
            }
        )
        
        # Update user info if they already exist
        if not created and user.full_name != name:
            user.full_name = name
            user.save()
        
        # Create JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Update last login
        update_last_login(None, user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Google authentication successful'
        }, status=status.HTTP_200_OK)
        
    except requests.RequestException as e:
        return Response({'error': 'Failed to verify Google token'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    print(f"Login request data: {request.data}")
    
    # Check if this is a Google login
    login_type = request.data.get('login_type', 'direct')
    
    if login_type == 'google':
        # Handle Google OAuth login
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required for Google login'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Find or create user based on email
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'full_name': email.split('@')[0],
                    'username': email.split('@')[0],
                    'is_active': True
                }
            )
            
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Google login successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Google login error: {e}")
            return Response({'error': 'Google login failed'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Handle regular email/password login
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    else:
        print(f"Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def refresh_token(request):
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token required'}, status=status.HTTP_400_BAD_REQUEST)
        
        token = RefreshToken(refresh_token)
        access_token = str(token.access_token)
        return Response({
            'access': access_token,
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_auth(request):
    """
    Handle Google OAuth authentication
    """
    id_token = request.data.get('id_token')
    
    if not id_token:
        return Response({'error': 'ID token is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verify the Google ID token
        response = requests.get(
            f'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={id_token}'
        )
        
        if response.status_code != 200:
            return Response({'error': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)
        
        token_info = response.json()
        
        # Verify the token is for our client
        if token_info.get('aud') != '599251054902-9s286dlgrjg24fkkler7vdk873q9hgac.apps.googleusercontent.com':
            return Response({'error': 'Token audience mismatch'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract user information
        email = token_info.get('email')
        name = token_info.get('name', '')
        google_id = token_info.get('sub')
        
        if not email:
            return Response({'error': 'Email is required from Google'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'full_name': name,
                'username': email.split('@')[0],
                'is_active': True
            }
        )
        
        # Update user info if they already exist
        if not created and user.full_name != name:
            user.full_name = name
            user.save()
        
        # Create JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Update last login
        update_last_login(None, user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Google authentication successful'
        }, status=status.HTTP_200_OK)
        
    except requests.RequestException as e:
        return Response({'error': 'Failed to verify Google token'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def edit_profile(request):
    user = request.user
    serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True, context={'request': request})
    
    if serializer.is_valid():
        updated_user = serializer.save()
        return Response({
            'user': UserSerializer(updated_user).data,
            'message': 'Profile updated successfully'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
