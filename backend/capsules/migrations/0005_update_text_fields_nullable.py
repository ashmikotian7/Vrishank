# Generated manually to handle migration issues with raw SQL

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('capsules', '0004_update_pin_lock_field'),
    ]

    operations = [
        migrations.RunSQL(
            [
                "ALTER TABLE capsules_capsule MODIFY COLUMN description TEXT NULL;",
                "ALTER TABLE capsules_capsule MODIFY COLUMN message TEXT NULL;"
            ],
            reverse_sql=[
                "ALTER TABLE capsules_capsule MODIFY COLUMN description TEXT NOT NULL;",
                "ALTER TABLE capsules_capsule MODIFY COLUMN message TEXT NOT NULL;"
            ]
        ),
    ]
