from django.core.management.base import BaseCommand
from django.utils import timezone
from capsules.models import Capsule
from capsules.utils import send_capsule_unlocked_notifications


class Command(BaseCommand):
    help = 'Check for capsules whose unlock time has been reached and send notifications'

    def handle(self, *args, **options):
        self.stdout.write("🔍 Checking for capsules ready to unlock...")
        
        # Get capsules that are unlocked but haven't had notifications sent
        ready_capsules = Capsule.objects.filter(
            unlock_date__lte=timezone.now(),
            unlock_notifications_sent=False
        ).prefetch_related('creator', 'recipients')
        
        if not ready_capsules.exists():
            self.stdout.write("✅ No capsules ready for unlock notifications")
            return
        
        self.stdout.write(f"📦 Found {ready_capsules.count()} capsules ready for unlock notifications")
        
        notifications_sent_count = 0
        for capsule in ready_capsules:
            try:
                self.stdout.write(f"🎉 Processing capsule: {capsule.title}")
                self.stdout.write(f"📅 Unlock time: {capsule.unlock_date}")
                self.stdout.write(f"👤 Creator: {capsule.creator.email if capsule.creator else 'None'}")
                
                # Send unlock notifications
                notifications = send_capsule_unlocked_notifications(capsule)
                notifications_sent_count += len(notifications)
                
                # Mark as sent
                capsule.unlock_notifications_sent = True
                capsule.save(update_fields=['unlock_notifications_sent'])
                
                self.stdout.write(f"✅ Notifications sent for capsule: {capsule.title}")
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Error processing capsule {capsule.title}: {str(e)}"))
        
        self.stdout.write(
            self.style.SUCCESS(f"🎉 Successfully sent {notifications_sent_count} unlock notifications")
        )
