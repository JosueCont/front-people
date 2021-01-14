# Generated by Django 3.0.9 on 2021-01-13 23:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0018_contactemergency_person'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='civil_status',
            field=models.IntegerField(blank=True, choices=[(1, 'Soltero'), (2, 'Casado'), (3, 'Divorsiado'), (4, 'Concubinato')], null=True, verbose_name='Estado Civil'),
        ),
    ]
