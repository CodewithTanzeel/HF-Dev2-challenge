import { initializeDatabase, db } from '../init';

export function addWaitlistEntry(email, displayName = null, publicDisplay = 1, referralCode = null, referralAttribution = null) {
    const timestamp = new Date().toISOString();
    try {
        const result = db.runSync(
            'INSERT INTO waitlist (email, display_name, public_display, signup_timestamp, referral_code, referral_attribution) VALUES (?, ?, ?, ?, ?, ?)',
            [email.toLowerCase().trim(), displayName ? displayName.trim() : null, publicDisplay ? 1 : 0, timestamp, referralCode, referralAttribution]
        );
        return { id: result.lastInsertRowId, email, displayName, publicDisplay, timestamp };
    } catch (e) {
        if (/unique/i.test(e.message || '')) {
            throw new Error('Email already registered on waitlist.');
        }
        throw e;
    }
}

export function getWaitlistEntries(limit = 50, offset = 0) {
    const rows = db.getAllSync(
        'SELECT id, email, display_name, public_display, signup_timestamp, referral_code FROM waitlist WHERE public_display = 1 ORDER BY signup_timestamp ASC LIMIT ? OFFSET ?',
        [limit, offset]
    );
    return rows || [];
}

export function getWaitlistCount() {
    const result = db.getFirstSync('SELECT COUNT(*) as count FROM waitlist WHERE public_display = 1');
    return result ? result.count : 0;
}

export function getTotalWaitlistCount() {
    const result = db.getFirstSync('SELECT COUNT(*) as count FROM waitlist');
    return result ? result.count : 0;
}

export function getWaitlistEntryByEmail(email) {
    const row = db.getFirstSync('SELECT * FROM waitlist WHERE email = ?', [email.toLowerCase().trim()]);
    return row || null;
}
