from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.db.models import Q
from .models import Capsule, CapsuleRecipient, CapsuleAttachment
from .serializers import (
    CapsuleSerializer, CapsuleCreateUpdateSerializer, 
    CapsuleDetailSerializer, CapsuleAttachmentSerializer
)

class CapsuleListCreateView(generics.ListCreateAPIView):
    serializer_class = CapsuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        user = self.request.user
        return Capsule.objects.filter(creator=user).select_related('creator').prefetch_related('recipients', 'attachments')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CapsuleCreateUpdateSerializer
        return CapsuleSerializer
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class CapsuleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CapsuleDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Capsule.objects.filter(
            Q(creator=user) | 
            Q(is_private=False, recipients__email=user.email)
        ).distinct().select_related('creator').prefetch_related('recipients', 'attachments')
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CapsuleCreateUpdateSerializer
        return CapsuleDetailSerializer
    
    def update(self, request, *args, **kwargs):
        capsule = self.get_object()
        if capsule.is_sealed:
            return Response(
                {'error': 'Cannot update a sealed capsule'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        capsule = self.get_object()
        if capsule.is_sealed:
            return Response(
                {'error': 'Cannot delete a sealed capsule'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def seal_capsule(request, pk):
    try:
        capsule = Capsule.objects.get(pk=pk, creator=request.user)
        if capsule.is_sealed:
            return Response(
                {'error': 'Capsule is already sealed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        capsule.is_sealed = True
        capsule.save()
        
        return Response({
            'message': 'Capsule sealed successfully',
            'capsule': CapsuleDetailSerializer(capsule, context={'request': request}).data
        }, status=status.HTTP_200_OK)
    
    except Capsule.DoesNotExist:
        return Response({'error': 'Capsule not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def unlock_capsule(request, pk):
    try:
        capsule = Capsule.objects.get(pk=pk)
        
        if not capsule.is_unlocked:
            return Response(
                {'error': 'Capsule cannot be unlocked yet'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pin = request.data.get('pin')
        if capsule.pin_lock and capsule.pin_lock != pin:
            return Response(
                {'error': 'Invalid PIN'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = CapsuleDetailSerializer(capsule, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Capsule.DoesNotExist:
        return Response({'error': 'Capsule not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_capsules(request):
    capsules = Capsule.objects.filter(creator=request.user).select_related('creator').prefetch_related('recipients', 'attachments')
    serializer = CapsuleSerializer(capsules, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def received_capsules(request):
    capsules = Capsule.objects.filter(
        recipients__email=request.user.email,
        is_private=False
    ).select_related('creator').prefetch_related('recipients', 'attachments').distinct()
    
    serializer = CapsuleSerializer(capsules, many=True, context={'request': request})
    return Response(serializer.data)

class CapsuleAttachmentUploadView(generics.CreateAPIView):
    serializer_class = CapsuleAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        capsule_id = self.kwargs.get('capsule_pk')
        try:
            capsule = Capsule.objects.get(pk=capsule_id, creator=self.request.user)
            if capsule.is_sealed:
                from rest_framework.exceptions import ValidationError
                raise ValidationError("Cannot upload files to a sealed capsule")
            
            uploaded_file = self.request.FILES.get('file')
            if uploaded_file:
                serializer.save(
                    capsule=capsule,
                    file_name=uploaded_file.name,
                    file_size=uploaded_file.size,
                    file_type=uploaded_file.content_type or 'application/octet-stream'
                )
        except Capsule.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("Capsule not found")

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_attachment(request, pk, attachment_pk):
    try:
        capsule = Capsule.objects.get(pk=pk, creator=request.user)
        if capsule.is_sealed:
            return Response(
                {'error': 'Cannot delete attachments from a sealed capsule'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        attachment = CapsuleAttachment.objects.get(pk=attachment_pk, capsule=capsule)
        attachment.file_path.delete()
        attachment.delete()
        
        return Response({'message': 'Attachment deleted successfully'}, status=status.HTTP_200_OK)
    
    except Capsule.DoesNotExist:
        return Response({'error': 'Capsule not found'}, status=status.HTTP_404_NOT_FOUND)
    except CapsuleAttachment.DoesNotExist:
        return Response({'error': 'Attachment not found'}, status=status.HTTP_404_NOT_FOUND)
