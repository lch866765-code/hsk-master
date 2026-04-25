export interface VocabWord {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning_ko: string;
  example_zh: string;
  example_ko: string;
  level: 3 | 4 | 5 | 6;
}

export interface CardState {
  wordId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: string;
  lapses: number;
  state: 'new' | 'learning' | 'review';
}

export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface StudySession {
  date: string;
  newCardsStudied: number;
  reviewsCompleted: number;
  totalTime: number;
}

export interface AppSettings {
  dailyNewCards: number;
  dailyReviews: number;
  enabledLevels: (3 | 4 | 5 | 6)[];
  darkMode: boolean;
}

export interface IntervalPreview {
  again: string;
  hard: string;
  good: string;
  easy: string;
}
