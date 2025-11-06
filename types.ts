export type CricketFormat = 'test' | 'odi' | 't20';

export type StatName =
  | 'matches'
  | 'runs'
  | 'highestScore'
  | 'battingAverage'
  | 'centuries'
  | 'fours'
  | 'sixes'
  | 'wickets'
  | 'bowlingAverage'
  | 'fiveWickets';

export interface Stat {
  matches?: number;
  runs?: number;
  highestScore?: string | number;
  battingAverage?: number;
  centuries?: number;
  fours?: number;
  sixes?: number;
  wickets?: number;
  bowlingAverage?: number;
  fiveWickets?: number;
}

export interface PlayerStats {
  test: Stat;
  odi: Stat;
  t20: Stat;
}

export interface PlayerCard {
  name: string;
  country: string;
  span: string;
  stats: PlayerStats;
  imagePath: string;
}
