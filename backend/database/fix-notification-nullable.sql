-- Fix notification table: make request_id nullable so event notifications work
ALTER TABLE notification MODIFY COLUMN request_id INT NULL;

-- Also make link column nullable if not already
ALTER TABLE notification MODIFY COLUMN link VARCHAR(500) NULL;

SELECT 'Notification table fixed - request_id is now nullable' AS Status;
