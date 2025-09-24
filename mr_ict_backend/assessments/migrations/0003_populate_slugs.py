from django.db import migrations
from django.utils.text import slugify


def populate_slugs(apps, schema_editor):
    Assessment = apps.get_model('assessments', 'Assessment')
    for assessment in Assessment.objects.filter(slug__isnull=True):
        base_slug = slugify(assessment.title) or f"assessment-{assessment.pk}"
        slug = base_slug
        suffix = 1
        while Assessment.objects.filter(slug=slug).exclude(pk=assessment.pk).exists():
            suffix += 1
            slug = f"{base_slug}-{suffix}"
        assessment.slug = slug
        assessment.save(update_fields=['slug'])


def reverse_slugs(apps, schema_editor):
    Assessment = apps.get_model('assessments', 'Assessment')
    Assessment.objects.update(slug=None)


class Migration(migrations.Migration):

    dependencies = [
        ('assessments', '0002_alter_assessment_options_alter_question_options_and_more'),
    ]

    operations = [
        migrations.RunPython(populate_slugs, reverse_slugs),
    ]
