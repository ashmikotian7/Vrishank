# Generated manually to handle migration issues with raw SQL

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('capsules', '0003_update_is_private_default'),
    ]

    operations = [
        migrations.RunSQL(
            "ALTER TABLE capsules_capsule MODIFY COLUMN pin_lock VARCHAR(20) NULL;",
            reverse_sql="ALTER TABLE capsules_capsule MODIFY COLUMN pin_lock VARCHAR(4) NULL;"
        ),
    ]
