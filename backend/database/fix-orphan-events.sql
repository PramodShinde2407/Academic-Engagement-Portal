UPDATE event e
JOIN club c ON (c.club_head_id = e.organizer_id OR c.club_mentor_id = e.organizer_id)
SET e.club_id = c.club_id
WHERE e.club_id IS NULL;
