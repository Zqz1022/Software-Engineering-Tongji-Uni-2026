CREATE TABLE app_user (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    display_name VARCHAR(80) NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT ck_app_user_status CHECK (status IN ('ACTIVE', 'RESTRICTED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE forum_board (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(80) NOT NULL,
    description VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO forum_board (code, name, description, sort_order) VALUES
    ('team-up', '课程组队', '寻找项目伙伴，交流课程设计想法。', 10),
    ('study', '学习交流', '分享学习经验，讨论课程问题。', 20),
    ('campus', '校园生活', '交流校园日常与实用信息。', 30),
    ('events', '活动信息', '发现校园活动与参与机会。', 40);
