# Summary: Adding club_mentor_id to Database

## What Was Done

### 1. Database Schema Updates

#### Created Migration File
**File**: `backend/database/add-club-mentor-id.sql`
- Adds `club_mentor_id` column to the `club` table
- Creates foreign key relationship to `user` table
- Allows NULL values for flexibility

#### Updated Schema File
**File**: `backend/database/schema.sql`
- Updated the `club` table definition to include `club_mentor_id`
- This ensures future database setups include this column

### 2. Code Already Compatible

The permission system code I updated earlier is **already using** `club_mentor_id`:

✅ **Permission Controller** (lines 75-80):
```javascript
const [clubRows] = await db.query(
    'SELECT club_mentor_id FROM club WHERE club_id = ?',
    [club_id]
);
const clubMentorId = clubRows[0]?.club_mentor_id;
```

✅ **Permission Model** (filtering):
```javascript
if (roleName === 'Club Mentor' && userId) {
    query += ` AND c.club_mentor_id = ?`;
    params.push(userId);
}
```

✅ **Club Model** (already includes club_mentor_id in create/update operations)

---

## Next Steps - ACTION REQUIRED

### You Need to Run the Migration

The database column doesn't exist yet in your actual database. You need to run the migration:

**Choose ONE of these methods:**

1. **MySQL Workbench**: Open and execute `add-club-mentor-id.sql`
2. **Command Line**: Run the SQL file using mysql command
3. **phpMyAdmin**: Copy/paste SQL and execute
4. **Direct SQL**: Run the ALTER TABLE command directly

See `MIGRATION_GUIDE.md` for detailed instructions.

---

## How the System Works After Migration

### Permission Request Flow:
1. **Club Head** creates permission request with `club_id`
2. System queries: `SELECT club_mentor_id FROM club WHERE club_id = ?`
3. **Specific Club Mentor** (identified by `club_mentor_id`) receives notification
4. Approval flows through: Club Mentor → Estate Manager → Principal → Director
5. **Both Club Head and Club Mentor** receive final approval notification

### Club Mentor Dashboard:
- Club mentors only see permission requests for clubs where they are the mentor
- Filter: `WHERE c.club_mentor_id = ?` (their user_id)

---

## Files Modified

1. ✅ `backend/database/schema.sql` - Updated club table definition
2. ✅ `backend/database/add-club-mentor-id.sql` - Created migration script
3. ✅ `backend/src/controllers/permission.controller.js` - Already using club_mentor_id
4. ✅ `backend/src/models/permission.model.js` - Already filtering by club_mentor_id
5. ✅ `backend/src/models/club.model.js` - Already includes club_mentor_id

---

## Testing After Migration

Once you run the migration:

1. Create a club with a club_mentor_id assigned
2. Have the club head create a permission request
3. Verify only that specific club mentor sees the request
4. Approve through all levels
5. Verify both club head and mentor receive final notification
