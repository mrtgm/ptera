CREATE SCHEMA IF NOT EXISTS ptera;

-- テーブル作成
CREATE TABLE IF NOT EXISTS ptera.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- テストデータ挿入
INSERT INTO ptera.users (username, email)
VALUES ('test_user', 'test@example.com')
ON CONFLICT (username) DO NOTHING;

-- インデックス作成
CREATE INDEX IF NOT EXISTS users_email_idx ON ptera.users(email);
