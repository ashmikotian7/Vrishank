from django.db import models
from django.conf import settings
from django.core.validators import RegexValidator
import uuid

class Capsule(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    message = models.TextField()
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='capsules'
    )
    is_private = models.BooleanField(default=True)
    pin_lock = models.CharField(
        max_length=4,
        blank=True,
        validators=[RegexValidator(r'^\d{4}$', 'PIN must be exactly 4 digits')]
    )
    unlock_date = models.DateTimeField()
    timezone = models.CharField(max_length=50, default='UTC')
    is_sealed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def is_unlocked(self):
        from django.utils import timezone
        return timezone.now() >= self.unlock_date

class CapsuleRecipient(models.Model):
    capsule = models.ForeignKey(
        Capsule,
        on_delete=models.CASCADE,
        related_name='recipients'
    )
    email = models.EmailField()
    is_notified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['capsule', 'email']

    def __str__(self):
        return f"{self.email} - {self.capsule.title}"

def capsule_attachment_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return f"capsules/{instance.capsule.id}/{filename}"

class CapsuleAttachment(models.Model):
    capsule = models.ForeignKey(
        Capsule,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    file_name = models.CharField(max_length=255)
    file_path = models.FileField(upload_to=capsule_attachment_path)
    file_size = models.IntegerField()
    file_type = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file_name} - {self.capsule.title}"
