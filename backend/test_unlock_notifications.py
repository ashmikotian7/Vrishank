#!/usr/bin/env python
import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'timecapsule.settings')
django.setup()

from capsules.models import Capsule
from capsules.utils import send_capsule_unlocked_notifications
from django.utils import timezone

print("🔍 Testing unlock notifications...")

# Get a test capsule
test_capsule = Capsule.objects.first()

if test_capsule:
    print(f"📦 Found capsule: {test_capsule.title}")
    print(f"📅 Unlock date: {test_capsule.unlock_date}")
    print(f"🔓 Is unlocked: {test_capsule.is_unlocked}")
    print(f"📧 Notifications sent: {test_capsule.unlock_notifications_sent}")
    
    # Test unlock notifications
    if test_capsule.is_unlocked:
        print("🎉 Sending unlock notifications...")
        notifications = send_capsule_unlocked_notifications(test_capsule)
        print(f"✅ Notifications sent to: {notifications}")
    else:
        print("⏰ Capsule not yet unlocked")
else:
    print("❌ No capsules found")
