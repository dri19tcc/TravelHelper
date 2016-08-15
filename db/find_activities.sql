
SELECT activity.*
FROM activity
INNER JOIN activity_tag
ON activity.id=activity_tag.activity_id
WHERE activity_tag.tag_id=$1;
