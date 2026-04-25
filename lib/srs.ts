import type { CardState, Rating, IntervalPreview } from './types';

const MIN_EASE_FACTOR = 1.3;
const MAX_INTERVAL = 365;

/**
 * Represents a human-readable interval for preview in the UI.
 * unit 'min' → value is minutes; unit 'day' → value is days.
 */
export interface IntervalResult {
  value: number;
  unit: 'min' | 'day';
}

export function calculateNextInterval(card: CardState, rating: Rating): CardState {
  const now = new Date();
  let { easeFactor, interval, repetitions, lapses } = card;

  if (repetitions === 0) {
    // Learning phase: card is new or has lapsed back to learning
    switch (rating) {
      case 'again':
        easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.20);
        interval = 0; // 1 minute
        // repetitions stays 0; lapses not incremented in learning phase
        break;

      case 'hard':
        easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.15);
        interval = -10; // 10 minutes (negative = sub-day minutes)
        // repetitions stays 0 (stays in learning)
        break;

      case 'good':
        interval = 1; // 1 day — graduates
        repetitions = 1;
        break;

      case 'easy':
        easeFactor = Math.min(4.0, easeFactor + 0.15);
        interval = 4; // 4 days — graduates
        repetitions = 1;
        break;
    }
  } else {
    // Review phase
    switch (rating) {
      case 'again':
        easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.20);
        lapses += 1;
        repetitions = 0; // back to learning
        interval = 0; // 1 minute
        break;

      case 'hard':
        easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.15);
        interval = Math.min(
          MAX_INTERVAL,
          Math.max(Math.round(interval * 1.2), interval + 1)
        );
        repetitions += 1;
        break;

      case 'good':
        interval = Math.min(MAX_INTERVAL, Math.round(interval * easeFactor));
        repetitions += 1;
        break;

      case 'easy':
        easeFactor = Math.min(4.0, easeFactor + 0.15);
        interval = Math.min(MAX_INTERVAL, Math.round(interval * easeFactor * 1.3));
        repetitions += 1;
        break;
    }
  }

  const dueDate = new Date(now);
  if (interval <= 0) {
    // Sub-day: interval === 0 → 1 min; interval < 0 → |interval| minutes
    const minutes = interval === 0 ? 1 : -interval;
    dueDate.setMinutes(dueDate.getMinutes() + minutes);
  } else {
    dueDate.setDate(dueDate.getDate() + interval);
    dueDate.setHours(0, 0, 0, 0);
  }

  const newState: CardState['state'] = interval >= 1 && repetitions > 0 ? 'review' : 'learning';

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    lapses,
    dueDate: dueDate.toISOString(),
    state: newState,
  };
}

export function createInitialCardState(wordId: string): CardState {
  return {
    wordId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    lapses: 0,
    state: 'new',
  };
}

export function isDueToday(card: CardState): boolean {
  const now = new Date();
  const due = new Date(card.dueDate);
  return due <= now;
}

/**
 * Returns the preview interval for a given card and rating as a structured value.
 * Use this to render labels like "1분", "10분", "1일", "4일".
 */
export function previewInterval(card: CardState, rating: Rating): IntervalResult {
  const next = calculateNextInterval(card, rating);
  if (next.interval <= 0) {
    const minutes = next.interval === 0 ? 1 : -next.interval;
    return { value: minutes, unit: 'min' };
  }
  return { value: next.interval, unit: 'day' };
}

export function getIntervalPreview(card: CardState): IntervalPreview {
  const format = (result: IntervalResult): string => {
    if (result.unit === 'min') return `${result.value}분`;
    const days = result.value;
    if (days === 1) return '1일';
    if (days < 30) return `${days}일`;
    if (days < 365) return `${Math.round(days / 30)}개월`;
    return `${Math.round(days / 365)}년`;
  };

  return {
    again: format(previewInterval(card, 'again')),
    hard: format(previewInterval(card, 'hard')),
    good: format(previewInterval(card, 'good')),
    easy: format(previewInterval(card, 'easy')),
  };
}
