# New Roles Setup Guide

## Overview
The system now supports **8 roles** in total:

### Original Roles (4)
1. **Student** - No key required
2. **Faculty** - Requires Faculty Key (reusable)
3. **Admin** - Requires Admin Key (one-time use)
4. **Club Head** - Requires Club Secret Key (one-time use per club)

### New Roles (4)
5. **Club Mentor** - Requires Club Mentor Key (reusable)
6. **Estate Manager** - Requires Estate Manager Key (reusable)
7. **Principal** - Requires Principal Key (one-time use)
8. **Director** - Requires Director Key (one-time use)

---

## Test Keys

Use these keys for testing registration:

| Role | Test Key | Type |
|------|----------|------|
| Club Mentor | `CLUB_MENTOR_KEY_2024` | Reusable |
| Estate Manager | `ESTATE_MANAGER_KEY_2024` | Reusable |
| Principal | `PRINCIPAL_KEY_2024` | One-time use |
| Director | `DIRECTOR_KEY_2024` | One-time use |

---

## Key Types Explained

### Reusable Keys
- **Faculty**, **Club Mentor**, **Estate Manager**
- Can be used multiple times
- Multiple users can register with the same key

### One-Time Use Keys
- **Admin**, **Principal**, **Director**
- Can only be used once
- After registration, the key is marked as "used"
- Ensures only one person can hold this role

### Club-Specific Keys
- **Club Head**
- Each club has its own secret key
- Only one Club Head per club
- Key is tied to a specific club

---

## Database Tables

### New Tables Created
```sql
club_mentor_key
estate_manager_key
principal_key
director_key
```

All tables follow the same structure:
- `key_id` - Auto-increment primary key
- `key_value` - Unique key string
- `used` - Boolean (only for one-time use keys)
- `created_at` - Timestamp

---

## How to Add More Keys

### For Reusable Keys (Faculty, Club Mentor, Estate Manager)
```sql
INSERT INTO club_mentor_key (key_value) VALUES ('YOUR_NEW_KEY');
INSERT INTO estate_manager_key (key_value) VALUES ('YOUR_NEW_KEY');
INSERT INTO faculty_key (key_value) VALUES ('YOUR_NEW_KEY');
```

### For One-Time Keys (Admin, Principal, Director)
```sql
INSERT INTO admin_key (key_value, used) VALUES ('YOUR_NEW_KEY', 0);
INSERT INTO principal_key (key_value, used) VALUES ('YOUR_NEW_KEY', 0);
INSERT INTO director_key (key_value, used) VALUES ('YOUR_NEW_KEY', 0);
```

---

## Testing Registration

### 1. Start the servers
```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm start
```

### 2. Go to registration page
Navigate to `http://localhost:3000/register`

### 3. Fill in the form
- Select one of the new roles from the dropdown
- Enter the corresponding test key
- Fill in other required fields
- Submit

### 4. Verify registration
```bash
cd backend
node view-users.js
```

---

## Files Modified

### Backend
- ✅ `src/controllers/auth.controller.js` - Added validation for 4 new roles
- ✅ `database/add-new-role-keys.sql` - SQL script to create tables
- ✅ `setup-new-roles.js` - Node script to setup tables
- ✅ `setup-new-roles.bat` - Batch script for Windows

### Frontend
- ✅ `src/auth/Register.js` - Updated to require keys for new roles

---

## Troubleshooting

### "Invalid [Role] Key" error
- Make sure you ran `node setup-new-roles.js` to create the tables
- Verify the key exists in the database
- Check for typos in the key

### Role not showing in dropdown
- Make sure the role exists in the `role` table
- Restart the frontend server
- Check browser console for errors

### One-time key already used
- The key can only be used once
- Add a new key to the database
- Or update the existing key: `UPDATE principal_key SET used = 0 WHERE key_value = 'YOUR_KEY'`

---

## Production Considerations

### Security
1. **Change all test keys** before deploying to production
2. Use **strong, random keys** (e.g., UUID or secure random strings)
3. Store keys securely and distribute them through secure channels
4. Consider implementing key expiration dates

### Key Generation
Use strong random keys:
```javascript
// Example: Generate a secure key
const crypto = require('crypto');
const key = crypto.randomBytes(32).toString('hex');
console.log(key);
```

### Key Distribution
- Send keys via secure channels (encrypted email, password managers)
- Don't commit keys to version control
- Keep a secure record of who received which keys
- Implement key rotation policies

---

## Summary

✅ **4 new roles added**: Club Mentor, Estate Manager, Principal, Director
✅ **Database tables created** for key validation
✅ **Backend validation** implemented
✅ **Frontend updated** to support new roles
✅ **Test keys provided** for immediate testing

The system is now ready to register users with all 8 roles!
