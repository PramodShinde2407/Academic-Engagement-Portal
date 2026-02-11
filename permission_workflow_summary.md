# Permission Approval Workflow - Changes Summary

## Overview
Updated the permission approval system to ensure:
1. **Specific Club Mentor Routing**: Permission requests from club heads are sent only to their specific club mentor (not all club mentors)
2. **Dual Notification on Approval**: After final approval by the Director, both the club head and club mentor receive notifications

---

## Changes Made

### 1. Permission Controller - Create Request
**File**: `permission.controller.js`

**Changes**:
- Added validation to require `club_id` when creating permission requests
- Modified notification logic to query the specific club's mentor ID from the database
- Sends notification only to the club mentor associated with that specific club

```javascript
// Get the specific club mentor for this club
const [clubRows] = await db.query(
    'SELECT club_mentor_id FROM club WHERE club_id = ?',
    [club_id]
);

const clubMentorId = clubRows[0]?.club_mentor_id;
```

---

### 2. Permission Controller - Final Approval
**File**: `permission.controller.js`

**Changes**:
- Updated final approval notification to send to both club head and club mentor
- Queries the club mentor ID from the database based on the request's club_id
- Both receive the same "APPROVED by all authorities" notification

```javascript
// Notify Club Head
await NotificationModel.create(request.club_head_id, ...);

// Also notify the club mentor
if (request.club_id) {
    const clubMentorId = // query from database
    if (clubMentorId) {
        await NotificationModel.create(clubMentorId, ...);
    }
}
```

---

### 3. Permission Model - Filter by Club Mentor
**File**: `permission.model.js`

**Changes**:
- Updated `findPendingForRole` to accept an optional `userId` parameter
- For Club Mentors, filters requests to only show those for clubs they mentor
- Other roles (Estate Manager, Principal, Director) see all pending requests for their level

```javascript
findPendingForRole: async (roleName, userId = null) => {
    // ... existing code ...
    
    // For Club Mentors, only show requests for their clubs
    if (roleName === 'Club Mentor' && userId) {
        query += ` AND c.club_mentor_id = ?`;
        params.push(userId);
    }
}
```

---

### 4. Permission Controller - Get Pending Requests
**File**: `permission.controller.js`

**Changes**:
- Updated `getPendingRequests` to pass the user's ID to the model
- Enables club mentor filtering to work correctly

```javascript
const userId = req.user.id;
const requests = await PermissionModel.findPendingForRole(userRole, userId);
```

---

## Approval Workflow

The complete approval flow is now:

1. **Club Head** creates permission request (must include club_id)
2. **Specific Club Mentor** receives notification and approves/rejects
3. **Estate Manager** receives notification and approves/rejects
4. **Principal** receives notification and approves/rejects
5. **Director** receives notification and approves/rejects
6. **Final Approval**: Both **Club Head** and **Club Mentor** receive approval notification

---

## Testing Checklist

✅ Club head creates permission with club_id  
✅ Only the specific club mentor receives notification  
✅ Other club mentors do NOT see the request  
✅ Approval flows through Estate Manager → Principal → Director  
✅ After Director approval, both club head and club mentor receive notifications  
✅ Rejection at any stage notifies the club head
