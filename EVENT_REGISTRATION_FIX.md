# Event Registration Fix - Complete Guide

## Problem Identified
The event registration was failing because the `event_registration` table was **missing from the database**.

## What Was Fixed

### 1. Created the Missing Database Table
- **File Created**: `backend/database/create-event-registration-table.sql`
- **Table Name**: `event_registration`
- **Columns**:
  - `registration_id` (Primary Key, Auto Increment)
  - `event_id` (Foreign Key to event table)
  - `student_id` (Foreign Key to user table)
  - `full_name` (VARCHAR 100)
  - `email` (VARCHAR 100)
  - `phone` (VARCHAR 20)
  - `department` (VARCHAR 100)
  - `year` (INT)
  - `roll_no` (VARCHAR 50)
  - `notes` (TEXT)
  - `registered_at` (TIMESTAMP, default CURRENT_TIMESTAMP)

### 2. Table Features
- **Unique Constraint**: Prevents duplicate registrations (same student can't register for the same event twice)
- **Foreign Keys**: Ensures data integrity with CASCADE delete
- **Timestamps**: Automatically tracks when registration was created

### 3. Verification Scripts Created
- `create-event-table.js` - Creates the table
- `verify-event-table.js` - Verifies table structure
- `test-event-registration.js` - Tests the registration flow

## How to Test Event Registration

### Option 1: Using the Web Interface (Recommended)

1. **Make sure both servers are running**:
   - Backend: `npm run dev` (in backend folder)
   - Frontend: `npm start` (in frontend folder)

2. **Open the application**:
   - Navigate to `http://localhost:3000`

3. **Login as a Student**:
   - Use your student credentials
   - If you don't have a student account, register one first

4. **Navigate to Events**:
   - Click on "Events" in the navigation menu
   - You should see a list of available events

5. **Register for an Event**:
   - Click on any event card
   - Click the "Register" button
   - Fill out the registration form with:
     - Full Name
     - Email
     - Phone Number
     - Department
     - Year (1-4)
     - Roll Number
     - Notes (optional)
   - Click "Register"

6. **Expected Result**:
   - ✅ Success message: "Registered successfully for [Event Name] 🎉"
   - The form should clear
   - You should receive a notification (if notification system is working)

### Option 2: Using the Test Script

Run the automated test:
```bash
cd backend
node test-event-registration.js
```

This will:
- Check if events exist
- Check if student users exist
- Attempt a test registration
- Verify the registration was saved
- Clean up test data

## Common Issues and Solutions

### Issue 1: "Failed to register ❌"

**Possible Causes**:
1. **Not logged in**: Make sure you're logged in as a student
2. **Token expired**: Try logging out and logging back in
3. **Backend not running**: Check if `npm run dev` is running in backend
4. **Database connection**: Verify database credentials in `.env`

**Solution**:
- Open browser console (F12) and check for error messages
- Check backend terminal for error logs
- Verify you're logged in (check localStorage for "token" and "user")

### Issue 2: "Duplicate entry" error

**Cause**: You're already registered for this event

**Solution**: This is expected behavior - you can only register once per event

### Issue 3: Backend errors

**Check**:
1. Backend terminal for error messages
2. Database connection in `.env` file:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=college_db
   ```

## Verification Checklist

✅ **Database Table**:
```bash
node verify-event-table.js
```
Should show the table structure with all columns

✅ **Backend Running**:
- Terminal should show: "Server running on port 5000"
- No error messages

✅ **Frontend Running**:
- Terminal should show: "webpack compiled successfully"
- Browser opens at `http://localhost:3000`

✅ **Authentication**:
- Can login successfully
- Token is stored in localStorage
- User data is stored in localStorage

✅ **Event Registration Flow**:
1. Can see events list
2. Can click on an event
3. Registration form loads
4. Can fill and submit form
5. Success message appears
6. No errors in console

## API Endpoint Details

### Register for Event
- **Endpoint**: `POST /api/event-registrations/register`
- **Authentication**: Required (Bearer token)
- **Request Body**:
```json
{
  "event_id": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "department": "Computer Science",
  "year": 2,
  "roll_no": "CS123",
  "notes": "Optional notes"
}
```
- **Response**: 
```json
{
  "message": "Event registered successfully"
}
```

### Get My Registrations
- **Endpoint**: `GET /api/event-registrations/my`
- **Authentication**: Required (Bearer token)
- **Response**: Array of events user has registered for

## Files Modified/Created

### Created:
1. `backend/database/create-event-registration-table.sql` - SQL schema
2. `backend/create-event-table.js` - Table creation script
3. `backend/verify-event-table.js` - Verification script
4. `backend/test-event-registration.js` - Test script
5. `EVENT_REGISTRATION_FIX.md` - This documentation

### Existing (Verified Working):
1. `backend/src/models/eventRegistration.model.js` - Database operations
2. `backend/src/controllers/eventRegistration.controller.js` - Business logic
3. `backend/src/routes/eventRegistration.routes.js` - API routes
4. `frontend/src/pages/EventRegisterPage.js` - Registration form

## Next Steps

1. **Test the registration** using the web interface
2. **Check notifications** - Club heads and mentors should receive notifications
3. **Verify data** - Check the database to see registered users:
   ```sql
   SELECT * FROM event_registration;
   ```

## Need Help?

If you're still experiencing issues:

1. **Check Backend Logs**: Look at the terminal running `npm run dev`
2. **Check Browser Console**: Press F12 and look for errors
3. **Verify Database**: Run `node verify-event-table.js`
4. **Test API Directly**: Use Postman or curl to test the endpoint

## Success Indicators

✅ Table created successfully
✅ Test registration works
✅ No backend errors
✅ Frontend shows success message
✅ Data appears in database

The event registration system should now be fully functional! 🎉
