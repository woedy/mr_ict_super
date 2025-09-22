import random
import re
import string
from django.contrib.auth import get_user_model, authenticate


def random_string_generator(size=10, chars=string.ascii_lowercase + string.digits):
    return "".join(random.choice(chars) for _ in range(size))


def generate_random_otp_code():
    code = ""
    for i in range(4):
        code += str(random.randint(0, 9))
    return code


def unique_user_id_generator(instance):
    """
    This is for a django project with a user_id field
    :param instance:
    :return:
    """

    size = random.randint(30, 45)
    user_id = random_string_generator(size=size)

    Klass = instance.__class__
    qs_exists = Klass.objects.filter(user_id=user_id).exists()
    if qs_exists:
        return None
    return user_id


def generate_email_token():
    code = ""
    for i in range(4):
        code += str(random.randint(0, 9))
    return code



def unique_school_id_generator(instance):
    """
    This is for a school_id field
    :param instance:
    :return:
    """
    size = random.randint(5, 10)
    school_id = "SCH-" + random_string_generator(size=size, chars=string.ascii_uppercase + string.digits) + "-OL"

    Klass = instance.__class__
    qs_exists = Klass.objects.filter(school_id=school_id).exists()
    if qs_exists:
        return None
    return school_id

def unique_student_id_generator(instance):
    """
    This is for a student_id field
    :param instance:
    :return:
    """
    size = random.randint(5, 10)
    student_id = "STU-" + random_string_generator(size=size, chars=string.ascii_uppercase + string.digits) + "-NT"

    Klass = instance.__class__
    qs_exists = Klass.objects.filter(student_id=student_id).exists()
    if qs_exists:
        return None
    return student_id



def unique_course_id_generator(instance):
    """
    This is for a course_id field
    :param instance:
    :return:
    """
    size = random.randint(5, 10)
    course_id = "COU-" + random_string_generator(size=size, chars=string.ascii_uppercase + string.digits) + "-SE"

    Klass = instance.__class__
    qs_exists = Klass.objects.filter(course_id=course_id).exists()
    if qs_exists:
        return None
    return course_id



def unique_lesson_id_generator(instance):
    """
    This is for a lesson_id field
    :param instance:
    :return:
    """
    size = random.randint(5, 10)
    lesson_id = "LES-" + random_string_generator(size=size, chars=string.ascii_uppercase + string.digits) + "-ON"

    Klass = instance.__class__
    qs_exists = Klass.objects.filter(lesson_id=lesson_id).exists()
    if qs_exists:
        return None
    return lesson_id




def unique_admin_id_generator(instance):
    """
    This is for a admin_id field
    :param instance:
    :return:
    """
    size = random.randint(5, 10)
    admin_id = "AD-" + random_string_generator(size=size, chars=string.ascii_uppercase + string.digits) + "-IN"

    Klass = instance.__class__
    qs_exists = Klass.objects.filter(admin_id=admin_id).exists()
    if qs_exists:
        return None
    return admin_id




def is_valid_email(email):
    # Regular expression pattern for basic email validation
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'

    # Using re.match to check if the email matches the pattern
    if re.match(pattern, email):
        return True
    else:
        return False


def is_valid_password(password):
    # Check for at least 8 characters
    if len(password) < 8:
        return False

    # Check for at least one uppercase letter
    if not re.search(r'[A-Z]', password):
        return False

    # Check for at least one lowercase letter
    if not re.search(r'[a-z]', password):
        return False

    # Check for at least one digit
    if not re.search(r'[0-9]', password):
        return False

    # Check for at least one special character
    if not re.search(r'[-!@#\$%^&*_()-+=/.,<>?"~`£{}|:;]', password):
        return False

    return True


