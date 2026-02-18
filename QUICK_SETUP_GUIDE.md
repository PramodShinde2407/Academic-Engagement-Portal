# Quick Setup Guide - Permission System

## What You Need to Do Now

### 1. Verify Database Migration ✅
You already ran this! The `club_mentor_id` column now exists in the `club` table.

### 2. Update Your Clubs with Mentor IDs ⚠️

**IMPORTANT**: Your existing clubs need to have `club_mentor_id` values set.

#### Option A: Using MySQL Workbench
```sql
-- View current clubs
SELECT club_id, name, club_head_id, club_mentor_id FROM club;

-- Update a club with its mentor
UPDATE club 
SET club_mentor_id = <mentor_user_id>
WHERE club_id = <club_id>;
```

#### Option B: When Creating New Clubs
Make sure the admin form or club creation process sets the `club_mentor_id` when creating clubs.

### 3. Test the System

#### Step 1: Prepare Test Data
```sql
-- Example: Set up a test club
UPDATE club 
SET club_mentor_id = 5  -- Replace with actual mentor user_id
WHERE club_id = 1;      -- Replace with actual club_id
```

#### Step 2: Test as Club Head
1. Log in as a club head
2. Go to permission request page
3. You should see a dropdown with your club(s)
4. Fill the form and submit
5. Check that the request was created

#### Step 3: Test as Club Mentor
1. Log in as the club mentor (user_id = 5 in example above)
2. Go to pending requests page
3. You should see the request from your club
4. Other club mentors should NOT see it

#### Step 4: Test Full Approval
1. Approve as club mentor
2. Approve as estate manager
3. Approve as principal
4. Approve as director
5. Check that both club head AND club mentor receive notifications

---

## Common Issues & Solutions

### Issue: "Club ID is required" error
**Solution**: Make sure the club dropdown is showing clubs. If not, the user might not be a club head of any club.

### Issue: Club mentor doesn't see the request
**Solution**: Check that the club has `club_mentor_id` set in the database:
```sql
SELECT club_id, name, club_mentor_id FROM club WHERE club_id = ?;
```

### Issue: Multiple club mentors see the same request
**Solution**: This shouldn't happen with the new code. Check that you're running the latest backend code.

### Issue: No clubs showing in dropdown
**Solution**: 
1. Check that clubs exist: `SELECT * FROM club;`
2. Check that user is a club head: `SELECT * FROM club WHERE club_head_id = <user_id>;`

---

## Quick SQL Commands

### View all clubs with their heads and mentors
```sql
SELECT 
    c.club_id,
    c.name AS club_name,
    h.name AS head_name,
    m.name AS mentor_name
FROM club c
LEFT JOIN user h ON c.club_head_id = h.user_id
LEFT JOIN user m ON c.club_mentor_id = m.user_id;
```

### Find users by role
```sql
SELECT u.user_id, u.name, u.email, r.role_name
FROM user u
JOIN role r ON u.role_id = r.role_id
WHERE r.role_name = 'Club Mentor';
```

### Update club mentor
```sql
UPDATE club 
SET club_mentor_id = <mentor_user_id>
WHERE club_id = <club_id>;
```

---

## System is Ready! 🎉

Once you've set `club_mentor_id` for your clubs, the entire permission system will work as designed:

✅ Club heads create requests for their specific clubs  
✅ Only the specific club mentor sees the request  
✅ Approval flows through all authorities  
✅ Both club head and mentor get final notification  

Happy testing!
