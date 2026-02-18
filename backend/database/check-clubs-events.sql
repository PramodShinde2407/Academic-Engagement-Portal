-- Step 1: See all clubs to find the AWS club
SELECT club_id, name, club_head_id, club_mentor_id FROM club;

-- Step 2: See all events and their current club associations
SELECT event_id, title, club_id, organizer_id FROM event ORDER BY event_id DESC LIMIT 20;
