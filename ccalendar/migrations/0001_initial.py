# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2016-12-29 16:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=1000)),
                ('location', models.CharField(max_length=10000)),
                ('starttime', models.DateTimeField(verbose_name='start time')),
                ('endtime', models.DateTimeField(verbose_name='End time')),
                ('description', models.CharField(max_length=1000000)),
            ],
        ),
    ]