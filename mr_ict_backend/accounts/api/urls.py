from django.urls import path

from accounts.api.admin_view import AdminLogin, register_admin_view
from accounts.api.custom_jwt import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    CustomTokenVerifyView,
)
from accounts.api.password_views import (
    PasswordResetView,
    confirm_otp_password_view,
    new_password_reset_view,
    resend_password_otp,
)
from accounts.api.student_views import (
    StudentLogin,
    register_student,
    resend_email_verification,
    verify_admin_email,
)
from accounts.api.teacher_view import (
    ClientLogin,
    register_client,
    resend_client_email_verification,
    verify_client_email,
)

app_name = 'accounts'

urlpatterns = [
    path('register-admin/', register_admin_view, name="register_weekend_Student_admin"),
    path('login-admin/', AdminLogin.as_view(), name="login_admin"),
    path('verify-email/', verify_admin_email, name="verify_admin_email"),
    path('resend-email-verification/', resend_email_verification, name="resend_admin_email_verification"),


    path('register-client/', register_client, name="register_client"),
    path('verify-client-email/', verify_client_email, name="verify_client_email"),
    path('resend-client-email-verification/', resend_client_email_verification, name="resend_client_email_verification"),
    path('login-client/', ClientLogin.as_view(), name="login_client"),
    

    path('register-student/', register_student, name="register_student"),
    path('login-student/', StudentLogin.as_view(), name="login_student"),
    path('verify-student-email/', verify_admin_email, name="verify_student_email"),
    path('resend-student-email-verification/', resend_email_verification, name="resend_student_email_verification"),



    path('forgot-user-password/', PasswordResetView.as_view(), name="forgot_password"),
    path('confirm-password-otp/', confirm_otp_password_view, name="confirm_otp_password"),
    path('resend-password-otp/', resend_password_otp, name="resend_password_otp"),
    path('new-password-reset/', new_password_reset_view, name="new_password_reset_view"),

    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', CustomTokenVerifyView.as_view(), name='token_verify'),

    #path('remove_user/', remove_user_view, name="remove_user_view"),
   # path('send-sms/', send_sms_view, name="send_sms_view"),

]
