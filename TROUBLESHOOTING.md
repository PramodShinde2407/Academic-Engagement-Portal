# 🔧 Club Head "Invalid Token" Troubleshooting Guide

## Quick Diagnosis Steps

### Step 1: Check if User is Logged In
Open browser DevTools (F12) → Console → Run:
```javascript
localStorage.getItem("token")
```

**If it returns `null`:**
- ❌ User is NOT logged in
- ✅ **Solution**: Log in with a Club Head account

**If it returns a long string:**
- ✅ Token exists, proceed to Step 2

---

### Step 2: Check User Role
In browser console, run:
```javascript
JSON.parse(localStorage.getItem("user"))
```

Look at the `role_name` field:

**If `role_name` is "Club Head":**
- ✅ User has correct role, proceed to Step 3

**If `role_name` is something else (Student, Faculty, etc.):**
- ❌ User does NOT have Club Head role
- ✅ **Solution**: Log out and log in with a Club Head account

---

### Step 3: Check Backend Logs
With the updated code, the backend now logs detailed information.

1. Look at your backend terminal (where `npm run dev` is running)
2. Try to send a permission request from the frontend
3. Look for these log messages:

**Good signs (✅):**
```
✅ Token verified for user: 6 role: 2
🔍 Checking if user 6 is a Club Head...
   User: CH | Email: ch@gmail.com | Role: Club Head
✅ User is a Club Head
```

**Bad signs (❌):**
```
❌ Auth failed: No authorization header or invalid format
```
→ Token is not being sent from frontend

```
❌ Auth failed: Token expired
```
→ Token has expired (older than 1 day)
→ **Solution**: Log out and log in again

```
❌ Auth failed: Invalid token
```
→ Token is malformed or corrupted
→ **Solution**: Clear localStorage and log in again

```
❌ Access denied: User has role Student but needs Club Head role
```
→ User is logged in but doesn't have Club Head role
→ **Solution**: Log in with a Club Head account

---

## Common Solutions

### Solution 1: Clear Cache and Re-login
```javascript
// Run in browser console
localStorage.clear()
// Then log in again
```

### Solution 2: Verify Club Head Users
Run this in backend directory:
```bash
node test-club-head-role.js
```

This will show all users with Club Head role.

### Solution 3: Use Token Diagnostic Tool
Run this in backend directory:
```bash
node diagnose-token.js
```

Then:
1. Copy your token from browser console: `localStorage.getItem("token")`
2. Paste it into the diagnostic tool
3. It will tell you exactly what's wrong

---

## Known Club Head Accounts

Based on the database check, these users have Club Head role:

1. **CH** - ch@gmail.com (User ID: 6)
2. **nss head** - nssh@gmail.com (User ID: 12)
3. **csi head** - chcsi@gamil.com (User ID: 15)

**Note**: You'll need to know their passwords to log in.

---

## Frontend Token Sending

The frontend sends tokens in two ways:

1. **Using `api` instance** (from `src/api/axios.js` or `src/api/api.js`):
   - Automatically adds token to all requests
   - Example: `api.get('/clubs')`

2. **Manual axios calls**:
   - Must manually add: `headers: { Authorization: \`Bearer ${token}\` }`
   - Example in PermissionRequestForm.js line 30-31

---

## If Nothing Works

1. Check if backend is running: `http://localhost:5000/api/users/roles`
2. Check if frontend is running: `http://localhost:3000`
3. Check browser Network tab to see the actual request being sent
4. Look for the `Authorization` header in the request
5. Check the response status code and message

---

## Contact Information

If you're still stuck, provide:
1. Backend console logs (copy the error messages)
2. Browser console errors (F12 → Console tab)
3. Network tab screenshot showing the failed request
4. Output of: `localStorage.getItem("user")` from browser console
