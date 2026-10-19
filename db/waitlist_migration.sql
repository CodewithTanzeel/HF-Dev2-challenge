CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    public_display BOOLEAN DEFAULT 1,
    signup_timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    referral_code TEXT,
    referral_attribution TEXT
);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
