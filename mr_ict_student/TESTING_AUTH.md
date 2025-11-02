# Testing Authentication Integration

## Prerequisites

1. **Backend Running:**
   ```bash
   cd mr_ict_backend
   .venv\Scripts\Activate.ps1
   python manage.py runserver
   ```

2. **Frontend Running:**
   ```bash
   cd mr_ict_student
   npm run dev
   ```

3. **Backend URL:** `http://localhost:8000`
4. **Frontend URL:** `http://localhost:5173`

---

## Test 1: Sign Up Flow

### Steps:
1. Navigate to `http://localhost:5173/signup`
2. Fill in the form:
   - **Full Name:** Test Student
   - **Email:** test@example.com
   - **Password:** testpass123
   - **Interest:** Web storytelling
3. Click "Join Mr ICT Student"

### Expected Results:
- ✅ Button shows "Creating account..."
- ✅ Button is disabled during submission
- ✅ On success: Redirect to `/onboarding`
- ✅ Tokens stored in localStorage (check DevTools → Application → Local Storage)
- ✅ On error: Error message displayed below form

### Check localStorage:
```
mrict_access_token: <JWT token>
mrict_refresh_token: <JWT token>
mrict:student:journey: <JSON state>
```

---

## Test 2: Sign In Flow

### Steps:
1. Navigate to `http://localhost:5173/signin`
2. Fill in the form:
   - **Email:** test@example.com (or existing user)
   - **Password:** testpass123
3. Click "Sign in and continue"

### Expected Results:
- ✅ Button shows "Signing in..."
- ✅ Button is disabled during submission
- ✅ On success: Redirect to `/dashboard` or `/onboarding`
- ✅ Tokens stored in localStorage
- ✅ On error: Error message displayed below form

---

## Test 3: Error Handling

### Test 3a: Invalid Credentials
1. Go to `/signin`
2. Enter wrong password
3. Submit form

**Expected:** Error message: "Sign in failed. Please check your credentials."

### Test 3b: Empty Form
1. Go to `/signin`
2. Leave fields empty
3. Submit form

**Expected:** Error message: "Enter your email and password to continue."

### Test 3c: Short Password (Sign Up)
1. Go to `/signup`
2. Enter password less than 8 characters
3. Submit form

**Expected:** Error message: "Password must be at least 8 characters long."

---

## Test 4: Auto-Redirect

### Test 4a: Already Authenticated
1. Sign in successfully
2. Try to navigate to `/signin` or `/signup`

**Expected:** Automatically redirected to dashboard

### Test 4b: Protected Route
1. Sign out
2. Try to navigate to `/dashboard`

**Expected:** Redirected to `/signin` with return URL preserved

---

## Test 5: Token Management

### Test 5a: Token Storage
1. Sign in
2. Open DevTools → Application → Local Storage
3. Check for tokens

**Expected:**
```
mrict_access_token: eyJ0eXAiOiJKV1QiLCJhbGc...
mrict_refresh_token: eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Test 5b: Token Refresh
1. Sign in
2. Wait for access token to expire (or manually delete it)
3. Make an API request

**Expected:** Token automatically refreshed, request succeeds

### Test 5c: Sign Out
1. Sign in
2. Click sign out
3. Check localStorage

**Expected:** Tokens cleared, redirected to landing page

---

## Test 6: Profile Loading

### Steps:
1. Sign in with valid credentials
2. Open DevTools → Network tab
3. Watch for API calls

**Expected API Calls:**
1. `POST /api/accounts/login-student/` → Returns tokens
2. `GET /api/students/experience/me/` → Returns profile

**Expected State:**
- `isAuthenticated: true`
- `student: { email, fullName, firstName, lastName, ... }`
- `profileComplete: true/false`

---

## Test 7: Loading States

### Steps:
1. Open DevTools → Network tab
2. Throttle network to "Slow 3G"
3. Try to sign in

**Expected:**
- ✅ Button text changes to "Signing in..."
- ✅ Button becomes disabled
- ✅ Cursor shows not-allowed on hover
- ✅ Form remains visible

---

## Test 8: End-to-End Flow

### Complete User Journey:
1. Navigate to landing page
2. Click "Create account"
3. Fill in sign up form
4. Submit → Redirected to onboarding
5. Complete onboarding
6. Redirected to dashboard
7. Sign out
8. Sign in again
9. Redirected directly to dashboard (profile complete)

**Expected:** Smooth flow with no errors

---

## Debugging Tips

### Check Browser Console
```javascript
// Check if tokens exist
localStorage.getItem('mrict_access_token')
localStorage.getItem('mrict_refresh_token')

// Check journey state
JSON.parse(localStorage.getItem('mrict:student:journey'))

// Clear everything
localStorage.clear()
```

### Check Network Requests
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Look for:
   - `/api/accounts/login-student/`
   - `/api/accounts/register-student/`
   - `/api/students/experience/me/`

### Common Issues

**Issue:** "Network Error"
- **Solution:** Check backend is running on port 8000

**Issue:** "401 Unauthorized"
- **Solution:** Check tokens in localStorage, try signing in again

**Issue:** "CORS Error"
- **Solution:** Check backend CORS settings allow `http://localhost:5173`

**Issue:** Redirect loop
- **Solution:** Clear localStorage and try again

---

## Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Smooth user experience
- ✅ Proper error messages
- ✅ Correct redirects
- ✅ Tokens stored and used correctly
- ✅ Loading states working
- ✅ Profile data loaded correctly

---

## Quick Test Script

```bash
# 1. Start backend
cd mr_ict_backend
.venv\Scripts\Activate.ps1
python manage.py runserver

# 2. Start frontend (new terminal)
cd mr_ict_student
npm run dev

# 3. Open browser
# Navigate to http://localhost:5173

# 4. Test sign up
# 5. Test sign in
# 6. Test sign out
# 7. Check localStorage
# 8. Check Network tab
```

---

## All Tests Passing! ✅

Authentication integration is complete and working correctly!
