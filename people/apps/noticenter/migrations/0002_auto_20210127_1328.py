# Generated by Django 3.0.9 on 2021-01-27 19:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('noticenter', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='category',
            field=models.IntegerField(choices=[(1, 'Aviso'), (2, 'Noticia')], default=1, verbose_name='Categoría'),
        ),
        migrations.AddField(
            model_name='notification',
            name='send_to_all',
            field=models.BooleanField(default=False, verbose_name='Enviar a todos'),
        ),
    ]
