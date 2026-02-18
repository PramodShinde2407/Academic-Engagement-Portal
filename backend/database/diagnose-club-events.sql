-- ============================================================
-- STEP 1: Run this first to SEE the current state
-- ============================================================

-- All clubs with their head and mentor
SELECT 
  c.club_id,
  c.name AS club_name,
  c.club_head_id,
  uh.name AS head_name,
  c.club_mentor_id,
  um.name AS mentor_name
FROM club c
LEFT JOIN user uh ON uh.user_id = c.club_head_id
LEFT JOIN user um ON um.user_id = c.club_mentor_id
ORDER BY c.club_id;

-- All events with their current club
SELECT 
  e.event_id,
  e.title,
  e.club_id,
  c.name AS club_name,
  e.organizer_id,
  u.name AS organizer_name
FROM event e
LEFT JOIN club c ON c.club_id = e.club_id
LEFT JOIN user u ON u.user_id = e.organizer_id
ORDER BY e.event_id DESC;
