from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('video_tutorials', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='recording',
            name='published',
            field=models.BooleanField(default=False),
        ),
    ]

