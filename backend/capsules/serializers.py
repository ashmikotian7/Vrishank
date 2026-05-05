from rest_framework import serializers
from django.utils import timezone
from .models import Capsule, CapsuleRecipient, CapsuleAttachment

class CapsuleRecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = CapsuleRecipient
        fields = ['id', 'email', 'is_notified', 'created_at']
        read_only_fields = ['id', 'is_notified', 'created_at']

class CapsuleAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CapsuleAttachment
        fields = ['id', 'file_name', 'file_path', 'file_url', 'file_size', 'file_type', 'uploaded_at']
        read_only_fields = ['id', 'file_size', 'file_type', 'uploaded_at']
    
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file_path and request:
            return request.build_absolute_uri(obj.file_path.url)
        return None

class CapsuleSerializer(serializers.ModelSerializer):
    creator = serializers.StringRelatedField(read_only=True)
    recipients = CapsuleRecipientSerializer(many=True, read_only=True)
    attachments = CapsuleAttachmentSerializer(many=True, read_only=True)
    is_unlocked = serializers.ReadOnlyField()
    recipient_emails = serializers.ListField(
        child=serializers.EmailField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Capsule
        fields = [
            'id', 'title', 'description', 'message', 'creator', 'is_private',
            'pin_lock', 'unlock_date', 'timezone', 'is_sealed', 'created_at',
            'updated_at', 'is_unlocked', 'recipients', 'attachments', 'recipient_emails'
        ]
        read_only_fields = ['id', 'creator', 'created_at', 'updated_at', 'is_unlocked']
    
    def validate_pin_lock(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("PIN must contain only digits")
        if value and len(value) != 4:
            raise serializers.ValidationError("PIN must be exactly 4 digits")
        return value
    
    def validate_unlock_date(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError("Unlock date must be in the future")
        return value
    
    def create(self, validated_data):
        recipient_emails = validated_data.pop('recipient_emails', [])
        capsule = Capsule.objects.create(**validated_data)
        
        for email in recipient_emails:
            CapsuleRecipient.objects.create(capsule=capsule, email=email)
        
        return capsule
    
    def update(self, instance, validated_data):
        recipient_emails = validated_data.pop('recipient_emails', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if recipient_emails is not None:
            instance.recipients.all().delete()
            for email in recipient_emails:
                CapsuleRecipient.objects.create(capsule=instance, email=email)
        
        return instance

class CapsuleCreateUpdateSerializer(CapsuleSerializer):
    class Meta(CapsuleSerializer.Meta):
        fields = [
            'title', 'description', 'message', 'is_private', 'pin_lock',
            'unlock_date', 'timezone', 'recipient_emails'
        ]

class CapsuleDetailSerializer(CapsuleSerializer):
    can_access = serializers.SerializerMethodField()
    
    class Meta(CapsuleSerializer.Meta):
        fields = CapsuleSerializer.Meta.fields + ['can_access']
    
    def get_can_access(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        if obj.creator == request.user:
            return True
        
        if not obj.is_private:
            return True
        
        return False
