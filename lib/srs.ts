import type { CardState, Rating, IntervalPreview } from './types';

const MIN_EASE_FACTOR = 1.3;

export function calculateNextInterval(card: CardState, rating: Rating): CardState {
  const now = new Date();
  let { easeFactor, interval, repetitions, lapses } = card;

  switch (rating) {
    case 'again':
      repetitions = 0;
      lapses += 1;
      easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.20);
      interval = 0;
      break;

    case 'hard':
      easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.15);
      if (repetitions === 0) {
        interval = 1;
      } else {
        interval = Math.ceil(interval * 1.2);
      }
      repetitions += 1;
      break;

    case 'good':
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 3;
      } else {
        interval = Math.ceil(interval * easeFactor);
      }
      repetitions += 1;
      break;

    case 'easy':
      easeFactor = Math.min(4.0, easeFactor + 0.15);
      if (repetitions === 0) {
        interval = 4;
      } else {
        interval = Math.ceil(interval * easeFactor * 1.3);
      }
      repetitions += 1;
      break;
  }

  const dueDate = new Date(now);
  if (interval === 0) {
    dueDate.setMinutes(dueDate.getMinutes() + 1);
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

export function getIntervalPreview(card: CardState): IntervalPreview {
  const formatInterval = (days: number): string => {
    if (days === 0) return '1분';
    if (days === 1) return '1일';
    if (days < 30) return `${days}일`;
    if (days < 365) return `${Math.round(days / 30)}개월`;
    return `${Math.round(days / 365)}년`;
  };

  const againCard = calculateNextInterval(card, 'again');
  const hardCard = calculateNextInterval(card, 'hard');
  const goodCard = calculateNextInterval(card, 'good');
  const easyCard = calculateNextInterval(card, 'easy');

  return {
    again: formatInterval(againCard.interval),
    hard: formatInterval(hardCard.interval),
    good: formatInterval(goodCard.interval),
    easy: formatInterval(easyCard.interval),
  };
}
