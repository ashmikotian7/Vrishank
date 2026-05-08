from django.core.management.base import BaseCommand
from django.utils import timezone
from capsules.models import Capsule
from capsules.utils import send_capsule_unlocked_notifications


class Command(BaseCommand):
    help = 'Send unlock notifications for capsules whose unlock time has been reached'

    def handle(self, *args, **options):
        self.stdout.write("🔍 Checking for capsules ready to unlock...")
        
        # Get capsules that are unlocked but haven't had notifications sent
        ready_capsules = Capsule.objects.filter(
            unlock_date__lte=timezone.now(),
            is_unlocked=True
        ).prefetch_related('creator', 'recipients')
        
        if not ready_capsules.exists():
            self.stdout.write("✅ No capsules ready for unlock notifications")
            return
        
        self.stdout.write(f"📦 Found {ready_capsules.count()} capsules ready for unlock notifications")
        
        notifications_sent_count = 0
        for capsule in ready_capsules:
            try:
                # Check if creator has already been notified for this capsule
                creator_notified = capsule.creator and hasattr(capsule.creator, 'userprofile') and capsule.creator.userprofile.unlock_notifications_sent.filter(capsule_id=capsule.id).exists()
                
                # Check if recipients have been notified
                recipients_notified = all(recipient.is_notified for recipient in capsule.recipients.all())
                
                # Only send if notifications haven't been sent yet
                if not creator_notified or not recipients_notified:
                    self.stdout.write(f"🎉 Sending unlock notifications for capsule: {capsule.title}")
                    notifications = send_capsule_unlocked_notifications(capsule)
                    notifications_sent_count += len(notifications)
                else:
                    self.stdout.write(f"⏭️  Skipping capsule {capsule.title} - notifications already sent")
                    
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Error processing capsule {capsule.title}: {str(e)}"))
        
        self.stdout.write(
            self.style.SUCCESS(f"🎉 Successfully sent {notifications_sent_count} unlock notifications")
        )
