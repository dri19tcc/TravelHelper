
SELECT activity.*, activity_tag.completed
FROM activity
INNER JOIN activity_tag
ON activity.google_id=activity_tag.activity_google_id
WHERE activity_tag.tag_id=$1;
