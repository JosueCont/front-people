# Generated by Django 3.0.9 on 2021-01-29 18:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0028_auto_20210128_1235'),
        ('noticenter', '0004_auto_20210129_1016'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='person.Person', verbose_name='Creado por'),
        ),
    ]
