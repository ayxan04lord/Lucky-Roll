import type { RollRecord, Stats, UserProfile, PlayResult, LeaderboardEntry } from './types';

const BASE = '/api';

export function getToken(): string | null {
  return localStorage.getItem('token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Token ${token}` } : {}),
  };
}

// ── Auth ──────────────────────────────────────────────

export async function register(username: string, password: string) {
  const res = await fetch(`${BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Qeydiyyat uğursuz oldu');
  return data as { token: string; username: string };
}

export async function login(username: string, password: string) {
  const res = await fetch(`${BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Daxil olma uğursuz oldu');
  return data as { token: string; username: string };
}

export async function logout() {
  await fetch(`${BASE}/auth/logout/`, { method: 'POST', headers: authHeaders() });
}

export async function fetchMe() {
  const res = await fetch(`${BASE}/auth/me/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Giriş tələb olunur');
  return res.json() as Promise<{ username: string; id: number; coins: number }>;
}

// ── Profile ───────────────────────────────────────────

export async function fetchProfile(): Promise<UserProfile> {
  const res = await fetch(`${BASE}/profile/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Profil yüklənmədi');
  return res.json();
}

export async function claimBonus(): Promise<{ coins: number; message: string }> {
  const res = await fetch(`${BASE}/profile/bonus/`, { method: 'POST', headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error ?? 'Bonus götürmək mümkün olmadı') as Error & {
      next_bonus_in?: string;
      next_bonus_at?: string;
    };
    err.next_bonus_in = data.next_bonus_in;
    err.next_bonus_at = data.next_bonus_at;
    throw err;
  }
  return data;
}

// ── Play ──────────────────────────────────────────────

export async function play(
  game_type: string,
  sides: number,
  dice_count: number,
  bet: number
): Promise<PlayResult> {
  const res = await fetch(`${BASE}/play/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ game_type, sides, dice_count, bet }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Oyun başlamadı');
  return data;
}

// ── History & Stats ───────────────────────────────────

export async function fetchHistory(): Promise<RollRecord[]> {
  const res = await fetch(`${BASE}/rolls/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Tarix yüklənmədi');
  return res.json();
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${BASE}/stats/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Statistika yüklənmədi');
  return res.json();
}

export async function clearHistory(): Promise<void> {
  const res = await fetch(`${BASE}/rolls/clear/`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Tarix silinmədi');
}

// ── Leaderboard ───────────────────────────────────────

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${BASE}/leaderboard/`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Liderboard yüklənmədi');
  return res.json();
}
