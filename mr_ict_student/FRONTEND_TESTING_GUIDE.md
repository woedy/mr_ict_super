# Frontend Testing Guide - Student Registration & Authentication

## 🧪 How to Test the Complete Student Journey

### Prerequisites
1. Backend running on `http://localhost:8000`
2. Frontend running on `http://localhost:5173`
3. Default school created (run `python create_default_school.py` in backend)

---

## Test 1: New Student Registration

### Steps:
1. Navigate to `http://localhost:5173/signup`
2. Fill in the form:
   - **Full Name:** John Doe
   - **Email:** john.doe@example.com
   - **Password:** SecurePass123! (note the requirements below)
   - **Interest:** Web storytelling
3. Click "Join Mr ICT Student"

### Password Requirements:
✅ Must be 8+ characters  
✅ Must include uppercase letter (A-Z)  
✅ Must include lowercase letter (a-z)  
✅ Must include number (0-9)  
✅ Must include special character (!@#$%^&*)  

### Expected Results:
- ✅ Button shows "Creating account..."
- ✅ Button is disabled during submission
- ✅ On success: Redirect to `/onboarding`
- ✅ Tokens stored in localStorage
- ✅ No console errors

### Check localStorage:
Open DevTools → Application → Local Storage → `http://localhost:5173`
```
mrict_access_token: eyJ...
mrict_refresh_token: eyJ...
mrict:student:journey: {...}
```

---

## Test 2: Email Verification (Development)

**Note:** In development, you need to manually verify the email.

### Option A: Auto-Verify (Recommended for Testing)
```bash
cd mr_ict_backend
python verify_test_user.py
```

### Option B: Get OTP from Database
```bash
cd mr_ict_backend
python manage.py shell
```
```python
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(email='john.doe@example.com')
print(f"Email Token: {user.email_token}")
```

Then use the token at: `http://localhost:5173/verify-email`

---

## Test 3: Sign In

### Steps:
1. Navigate to `http://localhost:5173/signin`
2. Fill in the form:
   - **Email:** john.doe@example.com
   - **Password:** SecurePass123!
3. Click "Sign in and continue"

### Expected Results:
- ✅ Button shows "Signing in..."
- ✅ Button is disabled during submission
- ✅ On success: Redirect to `/onboarding` (if not complete) or `/dashboard` (if complete)
- ✅ Tokens refreshed in localStorage
- ✅ No console errors

### If Email Not Verified:
You'll see an error: "Please check your email to confirm your account"
→ Run `python verify_test_user.py` in backend

---

## Test 4: Onboarding

### Steps:
1. After successful sign in, you should be at `/onboarding`
2. Complete the onboarding form:
   - **Language:** English
   - **Learning Goals:** Learn web development
   - **Availability:** Weekends
   - **Interests:** Select some interests
   - **Accessibility:** Select if needed
   - **Preferred Mode:** Interactive
3. Click "Complete setup"

### Expected Results:
- ✅ Form submits successfully
- ✅ Redirect to `/dashboard`
- ✅ Profile updated in localStorage
- ✅ `profileComplete: true` in context

---

## Test 5: Dashboard Access

### Steps:
1. After onboarding, you should be at `/dashboard`
2. Verify all data is displayed:
   - Student name
   - XP and level
   - Enrolled courses
   - Progress indicators

### Expected Results:
- ✅ Dashboard loads with student data
- ✅ No loading spinners stuck
- ✅ No console errors
- ✅ Profile data correct

---

## Test 6: Sign Out and Sign In Again

### Steps:
1. Click sign out button
2. Verify redirect to landing page
3. Sign in again with same credentials

### Expected Results:
- ✅ Tokens cleared on sign out
- ✅ Redirect to landing page
- ✅ Sign in successful
- ✅ Redirect to `/dashboard` (not onboarding, since already complete)
- ✅ `profileComplete: true`

---

## Test 7: Browse Catalog

### Steps:
1. Navigate to `/catalog`
2. Wait for courses to load
3. Try search functionality
4. Click on a course

### Expected Results:
- ✅ Loading skeletons show while loading
- ✅ Courses display in grid
- ✅ Search filters courses
- ✅ Course detail page loads
- ✅ No console errors

---

## Test 8: Protected Routes

### Steps:
1. Sign out
2. Try to access `/dashboard` directly
3. Try to access `/catalog` directly

### Expected Results:
- ✅ Redirect to `/signin`
- ✅ After sign in, redirect back to intended page
- ✅ No infinite redirects

---

## Test 9: Token Refresh

### Steps:
1. Sign in
2. Wait for access token to expire (30 minutes)
3. Make an API request (e.g., navigate to profile)

### Expected Results:
- ✅ Token automatically refreshed
- ✅ Request succeeds
- ✅ No logout
- ✅ No errors

---

## Test 10: Error Handling

### Test 10a: Invalid Credentials
1. Go to `/signin`
2. Enter wrong password
3. Submit

**Expected:** Error message: "Sign in failed. Please check your credentials."

### Test 10b: Weak Password
1. Go to `/signup`
2. Enter password: "weak"
3. Submit

**Expected:** Error message about password requirements

### Test 10c: Empty Form
1. Go to `/signup`
2. Leave fields empty
3. Submit

**Expected:** Error message: "Fill in your details to join the studio."

### Test 10d: Network Error
1. Stop backend server
2. Try to sign in

**Expected:** Error message about network/server error

---

## 🐛 Common Issues & Solutions

### Issue: "School does not exist"
**Solution:** Run `python create_default_school.py` in backend

### Issue: "Email not verified"
**Solution:** Run `python verify_test_user.py` in backend

### Issue: "Maximum update depth exceeded"
**Solution:** Already fixed! If you see this, clear browser cache and restart dev server

### Issue: Infinite redirects
**Solution:** Clear localStorage and sign in again

### Issue: Tokens not stored
**Solution:** Check browser console for errors, verify API responses

### Issue: CORS errors
**Solution:** Verify backend CORS settings allow `http://localhost:5173`

---

## ✅ Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Smooth user experience
- ✅ Proper error messages
- ✅ Correct redirects
- ✅ Tokens stored and used correctly
- ✅ Loading states working
- ✅ Profile data loaded correctly
- ✅ Onboarding flow complete
- ✅ Dashboard accessible after onboarding

---

## 📊 Test Checklist

- [ ] Registration with valid data works
- [ ] Registration with invalid password shows error
- [ ] Email verification works (manual or auto)
- [ ] Sign in with verified email works
- [ ] Sign in with unverified email shows error
- [ ] Onboarding form works
- [ ] Dashboard loads after onboarding
- [ ] Sign out clears tokens
- [ ] Sign in after onboarding skips onboarding
- [ ] Catalog loads courses
- [ ] Course detail page works
- [ ] Protected routes redirect to sign in
- [ ] Token refresh works automatically
- [ ] Error messages display correctly
- [ ] Loading states show during API calls

---

## 🎉 All Tests Passing?

If all tests pass, the student journey is working perfectly!

**Ready for production!** 🚀
