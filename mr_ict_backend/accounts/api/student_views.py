import re
from django.core.mail import send_mail
from django.contrib.auth import authenticate, get_user_model

from django.conf import settings
from django.template.loader import get_template
from rest_framework import status
from accounts.api.auth_utils import issue_tokens_for_user
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.api.password_views import check_email_exist
from accounts.api.serializers import UserRegistrationSerializer
from activities.models import AllActivity
from core.utils import generate_email_token
from schools.models import School
from students.models import Student

User = get_user_model()


@api_view(['POST', ])
@permission_classes([])
@authentication_classes([])
def register_student(request):

    payload = {}
    data = {}
    errors = {}

    if request.method == 'POST':
        school_id = request.data.get('school_id', "")
        email = request.data.get('email', "").lower()
        first_name = request.data.get('first_name', "")
        last_name = request.data.get('last_name', "")
        phone = request.data.get('phone', "")
        photo = request.data.get('photo', "")
        #photo = request.FILES.get('photo')
        country = request.data.get('country', "")
        password = request.data.get('password', "")
        password2 = request.data.get('password2', "")



        if not email:
            errors['email'] = ['User Email is required.']
        elif not is_valid_email(email):
            errors['email'] = ['Valid email required.']
        elif check_email_exist(email):
            errors['email'] = ['Email already exists in our database.']

        if not first_name:
            errors['first_name'] = ['First Name is required.']

        if not last_name:
            errors['last_name'] = ['Last Name is required.']

        if not password:
            errors['password'] = ['Password is required.']

        if not password2:
            errors['password2'] = ['Password2 is required.']

        if password != password2:
            errors['password'] = ['Passwords dont match.']

        if not is_valid_password(password):
            errors['password'] = ['Password must be at least 8 characters long\n- Must include at least one uppercase letter,\n- One lowercase letter, one digit,\n- And one special character']

        try:
            school = School.objects.get(school_id=school_id)
        except:
            errors['school_id'] = ['School does not exist.']



        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            data["user_id"] = user.user_id
            data["email"] = user.email
            data["first_name"] = user.first_name
            data["last_name"] = user.last_name

            user.user_type = "Student"
            user.phone=phone
            if photo:
                user.photo=photo
            user.country=country
            user.save()

            student = Student.objects.create(
                user=user,
                school=school
            )
            student.save()
         
            photo = getattr(user, 'photo', None)
            data['photo'] = photo.url if photo and hasattr(photo, 'url') else None

        data.update(issue_tokens_for_user(user))
        data["requires_onboarding"] = True

        email_token = generate_email_token()

        user = User.objects.get(email=email)
        user.email_token = email_token
        user.save()


        ##### SEND SMS

        #_msg = f'Your Weekend Student OTP code is {email_token}'
        #url = f"https://apps.mnotify.net/smsapi"
        #api_key = settings.MNOTIFY_KEY  # Replace with your actual API key
#
        #print(api_key)
        #response = requests.post(url,
        #data={
        #    "key": api_key,
        #    "to": user.phone,
        #    "msg": _msg,
        #    "sender_id": settings.MNOTIFY_SENDER_ID,
        #    })
        #if response.status_code == 200:
        #    print('##########################')
        #    print(response.content)
        #    payload['message'] = "Successful"
        #else:
        #    errors['user_id'] = ['Failed to send SMS']
#
        #    ######################


        context = {
            'email_token': email_token,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
        # ##
        txt_ = get_template("registration/emails/verify.txt").render(context)
        html_ = get_template("registration/emails/verify.html").render(context)
        # ##
        subject = 'EMAIL CONFIRMATION CODE'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [user.email]



        # # Use Celery chain to execute tasks in sequence
        # email_chain = chain(
        #     send_generic_email.si(subject, txt_, from_email, recipient_list, html_),
        # )
        # # Execute the Celery chain asynchronously
        # email_chain.apply_async()

        send_mail(
            subject,
            txt_,
            from_email,
            recipient_list,
            html_message=html_,
            fail_silently=False,
        )





        new_activity = AllActivity.objects.create(
            user=user,
            subject="Student Registration",
            body=user.email + " Just created an account."
        )
        new_activity.save()

        payload['message'] = "Successful"
        payload['data'] = data

    return Response(payload)





class StudentLogin(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        payload = {}
        data = {}
        errors = {}


        email = request.data.get('email', '').lower()
        password = request.data.get('password', '')
        fcm_token = request.data.get('fcm_token', '')

        if not email:
            errors['email'] = ['Email is required.']

        if not password:
            errors['password'] = ['Password is required.']

        if not fcm_token:
            errors['fcm_token'] = ['FCM device token is required.']

        if errors:
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            errors['email'] = ['User does not exist.']
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        if not user.email_verified:
            errors['email'] = ["Please check your email to confirm your account or resend confirmation email."]
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(password):
            errors['password'] = ['Invalid Credentials']
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        if user.user_type != "Student":
            errors['email'] = ['This account is not a student account.']
            payload['message'] = "Errors"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        user.fcm_token = fcm_token
        user.save()

        data["user_id"] = user.user_id
        data["email"] = user.email
        data["first_name"] = user.first_name
        data["last_name"] = user.last_name
        photo = getattr(user, "photo", None)
        data["photo"] = photo.url if photo and hasattr(photo, "url") else None
        data["country"] = user.country
        data["phone"] = user.phone

        # Handle student profile safely
        try:
            student = user.student
            data["student_id"] = student.student_id
            data["epz"] = student.epz
            data["requires_onboarding"] = not getattr(student, "has_completed_onboarding", False)
        except AttributeError:
            # User doesn't have a student profile yet
            data["student_id"] = None
            data["epz"] = 0
            data["requires_onboarding"] = True

        data.update(issue_tokens_for_user(user))

        payload['message'] = "Successful"
        payload['data'] = data

        new_activity = AllActivity.objects.create(
            user=user,
            subject="Student Login",
            body=user.email + " Just logged in."
        )
        new_activity.save()

        return Response(payload, status=status.HTTP_200_OK)



@api_view(['POST', ])
@permission_classes([])
@authentication_classes([])
def verify_admin_email(request):
    payload = {}
    data = {}
    errors = {}

    email_errors = []
    token_errors = []

    email = request.data.get('email', '').lower()
    email_token = request.data.get('email_token', '')

    if not email:
        email_errors.append('Email is required.')

    qs = User.objects.filter(email=email)
    if not qs.exists():
        email_errors.append('Email does not exist.')

    if email_errors:
        errors['email'] = email_errors

    if not email_token:
        token_errors.append('Token is required.')
    elif len(email_token) != 4 or not email_token.isdigit():
        token_errors.append('Token must be a 4-digit code.')

    user = None
    if qs.exists():
        user = qs.first()
        if not token_errors and email_token != user.email_token:
            token_errors.append('Invalid Token.')

    if token_errors:
        errors['email_token'] = token_errors

    if email_errors or token_errors:
        payload['message'] = "Errors"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)



    user.is_active = True
    user.email_verified = True
    user.save()

    data["user_id"] = user.user_id
    data["email"] = user.email
    data["first_name"] = user.first_name
    data["last_name"] = user.last_name
    photo = getattr(user, 'photo', None)
    data["photo"] = photo.url if photo and hasattr(photo, 'url') else None
    data.update(issue_tokens_for_user(user))

    payload['message'] = "Successful"
    payload['data'] = data

    new_activity = AllActivity.objects.create(
        user=user,
        subject="Verify Email",
        body=user.email + " just verified their email",
    )
    new_activity.save()

    return Response(payload, status=status.HTTP_200_OK)



@api_view(['POST', ])
@permission_classes([AllowAny])
@authentication_classes([])
def resend_email_verification(request):
    payload = {}
    data = {}
    errors = {}
    email_errors = []


    email = request.data.get('email', '').lower()

    if not email:
        email_errors.append('Email is required.')
    if email_errors:
        errors['email'] = email_errors
        payload['message'] = "Error"
        payload['errors'] = errors
        return Response(payload, status=status.HTTP_404_NOT_FOUND)

    qs = User.objects.filter(email=email)
    if not qs.exists():
        email_errors.append('Email does not exist.')
        if email_errors:
            errors['email'] = email_errors
            payload['message'] = "Error"
            payload['errors'] = errors
            return Response(payload, status=status.HTTP_404_NOT_FOUND)

    user = User.objects.filter(email=email).first()
    otp_code = generate_email_token()
    user.email_token = otp_code
    user.save()



     ##### SEND SMS

    # _msg = f'Your Weekend Student OTP code is {otp_code}'
    # url = f"https://apps.mnotify.net/smsapi"
    # api_key = settings.MNOTIFY_KEY  # Replace with your actual API key
    # print(api_key)
    # response = requests.post(url,
    # data={
    #     "key": api_key,
    #     "to": user.phone,
    #     "msg": _msg,
    #     "sender_id": settings.MNOTIFY_SENDER_ID,
    #     })
    # if response.status_code == 200:
    #     print('##########################')
    #     print(response.content)
    #     payload['message'] = "Successful"
    # else:
    #     errors['user_id'] = ['Failed to send SMS']
    #     ######################


    context = {
        'email_token': otp_code,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name
    }
#
    txt_ = get_template("registration/emails/verify.txt").render(context)
    html_ = get_template("registration/emails/verify.html").render(context)
#
    subject = 'OTP CODE'
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]

     # Use Celery chain to execute tasks in sequence
    # email_chain = chain(
    #      send_generic_email.si(subject, txt_, from_email, recipient_list, html_),
    #   )
    #  # Execute the Celery chain asynchronously
    # email_chain.apply_async()

    send_mail(
        subject,
        txt_,
        from_email,
        recipient_list,
        html_message=html_,
        fail_silently=False,
    )

    #data["otp_code"] = otp_code
    data["email"] = user.email
    data["user_id"] = user.user_id

    new_activity = AllActivity.objects.create(
        user=user,
        subject="Email verification sent",
        body="Email verification sent to " + user.email,
    )
    new_activity.save()

    payload['message'] = "Successful"
    payload['data'] = data

    return Response(payload, status=status.HTTP_200_OK)



def check_password(email, password):

    try:
        user = User.objects.get(email=email)
        return user.check_password(password)
    except User.DoesNotExist:
        return False





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



