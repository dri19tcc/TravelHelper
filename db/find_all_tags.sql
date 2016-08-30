
SELECT tag.id, tag.name, tag.modified_date, users.google_id, users.id, user_tag.tag_id, user_tag.user_id
FROM users
INNER JOIN user_tag
ON users.id=user_tag.user_id
INNER JOIN tag
ON user_tag.tag_id=tag.id
WHERE users.google_id=$1
ORDER BY tag.modified_date DESC;
