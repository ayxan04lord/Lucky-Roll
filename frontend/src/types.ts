export type DiceSides = 4 | 6 | 8 | 10 | 12 | 20;
export type GameType = 'classic' | 'lucky7' | 'jackpot';
export type ResultLabel = 'jackpot' | 'big_win' | 'win' | 'lose';

export interface UserProfile {
  username: string;
  coins: number;
  total_won: number;
  total_spent: number;
  games_played: number;
  last_bonus: string | null;
}

export interface RollRecord {
  id: number;
  game_type: GameType;
  values: number[];
  sides: number;
  total: number;
  bet: number;
  winnings: number;
  timestamp: string;
}

export interface PlayResult {
  roll: RollRecord;
  profile: UserProfile;
  result_label: ResultLabel;
  net: number;
}

export interface LeaderboardEntry {
  username: string;
  coins: number;
  total_won: number;
  games_played: number;
}

export interface Stats {
  totalRolls: number;
  highestTotal: number;
  averageTotal: number;
  totalWon: number;
  totalSpent: number;
  faceFrequency: Record<number, number>;
}

export type Theme = 'dark' | 'light';
