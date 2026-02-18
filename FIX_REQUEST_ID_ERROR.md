# FIX: Unknown column 'request_id' Error

## Problem
The `notification` table is missing the `request_id` column that the permission system needs.

## Solution
Run the migration script to add the `request_id` column.

### Steps:

1. **Open MySQL Workbench**
2. **Connect to your database**
3. **Open the file**: `backend/database/add-request-id-to-notification.sql`
4. **Execute the script** (click the lightning bolt icon)

### OR use Command Line:
```bash
mysql -u root -p college_db < backend/database/add-request-id-to-notification.sql
```

### What This Does:
- Adds `request_id` column to the `notification` table
- Creates a foreign key relationship to `permission_request` table
- Allows the permission system to link notifications to specific requests

### After Running:
1. The backend error will be fixed
2. Permission requests will work properly
3. Notifications will be linked to their requests

---

## Why This Happened
The `notification` table was created for the club registration system (with columns: `user_id`, `title`, `message`, `type`, `link`), but the permission system needs an additional `request_id` column to link notifications to permission requests.

---

## Verify It Worked
After running the migration, you should be able to:
1. Create a permission request as a club head
2. See the notification sent to the club mentor
3. No more "Unknown column 'request_id'" errors in the backend

---

## Quick Test
1. Log in as a club head
2. Go to permission request form
3. Select a club and fill in the details
4. Submit the request
5. Check that no errors appear in the backend terminal
6. Log in as the club mentor
7. Verify you see the notification
