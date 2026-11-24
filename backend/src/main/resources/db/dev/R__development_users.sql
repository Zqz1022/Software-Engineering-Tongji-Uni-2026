-- Only loaded by dev/test profiles. These fixtures are not social accounts.
INSERT INTO app_user (id, display_name, status) VALUES
    (1001, '开发用户一', 'ACTIVE'),
    (1002, '开发用户二', 'ACTIVE'),
    (1003, '开发用户三', 'ACTIVE'),
    (1004, '开发用户四', 'ACTIVE')
ON DUPLICATE KEY UPDATE id = app_user.id;
