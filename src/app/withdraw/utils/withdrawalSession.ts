const SESSION_KEY = 'withdraw_last_id';
const TTL_MS = 5 * 60 * 1000;

interface SessionEntry {
  id: string;
  savedAt: number;
}

export function saveSession(id: string): void {
  const entry: SessionEntry = { id, savedAt: Date.now() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(entry));
}

export function loadSession(): string | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const entry: SessionEntry = JSON.parse(raw) as SessionEntry;
    if (Date.now() - entry.savedAt > TTL_MS) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return entry.id;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
