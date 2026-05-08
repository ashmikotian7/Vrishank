# Generated manually to handle migration issues

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('capsules', '0002_add_unlock_notifications_sent'),
    ]

    operations = [
        migrations.AlterField(
            model_name='capsule',
            name='is_private',
            field=models.BooleanField(default=False),
        ),
    ]
