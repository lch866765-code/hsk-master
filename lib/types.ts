import type { PartOfSpeech } from './pos';

export type { PartOfSpeech };

export interface VocabWord {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning_ko: string;
  example_zh: string;
  example_ko: string;
  level: 3 | 4 | 5 | 6;
  pos: PartOfSpeech;
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
  selectedPos: PartOfSpeech[];
}

export interface IntervalPreview {
  again: string;
  hard: string;
  good: string;
  easy: string;
}

export type ExamMode = 'mc' | 'dictation' | 'mixed';
export type ExamSourcePool = 'studied' | 'all';

export interface ExamQuestion {
  id: string;
  word: VocabWord;
  mode: 'mc' | 'dictation';
  /** For MC: the 4 options (one correct, three distractors) */
  options?: string[];
  /** For MC: index of correct option in options array */
  correctOptionIndex?: number;
}

export interface ExamResult {
  id: string;
  date: string;
  mode: ExamMode;
  totalQuestions: number;
  correctCount: number;
  elapsedSeconds: number;
  wrongWordIds: string[];
  levels: (3 | 4 | 5 | 6)[];
}

