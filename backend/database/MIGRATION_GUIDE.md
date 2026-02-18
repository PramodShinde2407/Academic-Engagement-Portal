# Database Migration Guide - Add club_mentor_id

## Step 1: Run the Migration SQL

You need to execute the SQL migration to add the `club_mentor_id` column to your existing database.

### Option A: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your `college_db` database
3. Open the file: `backend/database/add-club-mentor-id.sql`
4. Click "Execute" (lightning bolt icon)

### Option B: Using Command Line
```bash
# Navigate to the backend directory
cd backend

# Run the SQL file (you'll be prompted for password)
mysql -u root -p college_db < database/add-club-mentor-id.sql
```

### Option C: Using phpMyAdmin
1. Open phpMyAdmin
2. Select `college_db` database
3. Go to SQL tab
4. Copy and paste the contents of `add-club-mentor-id.sql`
5. Click "Go"

### Option D: Manual SQL Execution
Run these commands directly in your MySQL client:

```sql
USE college_db;

ALTER TABLE club 
ADD COLUMN club_mentor_id INT NULL AFTER club_head_id,
ADD FOREIGN KEY (club_mentor_id) REFERENCES user(user_id);

DESCRIBE club;
```

---

## Step 2: Verify the Migration

After running the migration, verify that the column was added:

```sql
DESCRIBE club;
```

You should see `club_mentor_id` in the output.

---

## What This Migration Does

- Adds `club_mentor_id` column to the `club` table
- Creates a foreign key relationship to the `user` table
- Allows NULL values (clubs can exist without a mentor initially)
- Places the column right after `club_head_id` for logical ordering

---

## Already Updated Files

✅ **Schema file updated**: `backend/database/schema.sql` now includes `club_mentor_id`
✅ **Permission controller**: Already uses `club_mentor_id` to route notifications
✅ **Club model**: Already includes `club_mentor_id` in create/update operations

Once you run this migration, the permission system will work correctly!
