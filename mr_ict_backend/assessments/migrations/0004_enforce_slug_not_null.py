from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessments', '0003_populate_slugs'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assessment',
            name='slug',
            field=models.SlugField(max_length=255, unique=True),
        ),
    ]
