-- 愚痴一時保存テーブル
-- シュレッダー実行時に完全削除される
CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  sentiment TEXT NOT NULL,
  intensity INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

-- 統計用インデックス
CREATE INDEX IF NOT EXISTS idx_complaints_sentiment ON complaints(sentiment);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at);
