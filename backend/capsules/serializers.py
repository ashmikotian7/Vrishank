from rest_framework import serializers
from django.utils import timezone
import pytz
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
        read_only_fields = ['id', 'file_name', 'file_size', 'file_type', 'uploaded_at']
    
        
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
        from django.utils import timezone
        # Get the timezone from the data or default to UTC
        tz_str = self.initial_data.get('timezone', 'UTC')
        
        # If the provided datetime is naive, assume it's in the specified timezone
        if timezone.is_naive(value):
            try:
                tz = pytz.timezone(tz_str)
                value = timezone.make_aware(value, tz)
            except Exception:
                # If timezone conversion fails, use server's default timezone
                value = timezone.make_aware(value)
        
        # Compare with current time in the same timezone
        if value <= timezone.now():
            raise serializers.ValidationError("Unlock date must be in the future")
        return value
    
    def create(self, validated_data):
        print("=== DEBUG: Capsule Create Data ===")
        print(f"Validated data: {validated_data}")
        recipient_emails = validated_data.pop('recipient_emails', [])
        attachment_files = validated_data.pop('attachments', [])
        print(f"Recipient emails: {recipient_emails}")
        print(f"Attachment files: {len(attachment_files)}")
        print(f"Title: {validated_data.get('title')}")
        print(f"Description: {validated_data.get('description')}")
        print(f"Message: {validated_data.get('message')}")
        print("================================")
        
        capsule = Capsule.objects.create(**validated_data)
        
        for email in recipient_emails:
            CapsuleRecipient.objects.create(capsule=capsule, email=email)
        
        # Create attachments
        for file in attachment_files:
            CapsuleAttachment.objects.create(
                capsule=capsule,
                file_name=file.name,
                file_path=file,
                file_size=file.size,
                file_type=file.content_type or 'application/octet-stream'
            )
        
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
    attachments = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )
    
    class Meta(CapsuleSerializer.Meta):
        fields = [
            'id', 'title', 'description', 'message', 'is_private', 'pin_lock',
            'unlock_date', 'timezone', 'recipient_emails', 'attachments'
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
