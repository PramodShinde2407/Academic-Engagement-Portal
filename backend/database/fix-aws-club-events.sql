-- Fix: Link AWS events to the correct AWS Club (club_id = 20)
-- Event 18: 'cloud computing with aws' was wrongly linked to Photography Club (club_id=5)

UPDATE event SET club_id = 20 WHERE event_id = 18;

-- Also fix any other events that belong to AWS club but are wrongly assigned
-- (events created by AWS Club Head user_id=21 or Mentor user_id=22 with wrong club_id)
UPDATE event 
SET club_id = 20 
WHERE organizer_id IN (21, 22) 
  AND (club_id != 20 OR club_id IS NULL);

-- Verify the fix
SELECT e.event_id, e.title, e.club_id, c.name AS club_name, e.organizer_id
FROM event e
LEFT JOIN club c ON c.club_id = e.club_id
WHERE e.organizer_id IN (21, 22)
ORDER BY e.event_id DESC;
