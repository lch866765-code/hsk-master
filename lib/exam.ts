import type { VocabWord, ExamQuestion, ExamMode, ExamSourcePool, PartOfSpeech } from './types';

export interface GenerateExamOptions {
  allWords: VocabWord[];
  cardStudiedMap: Record<string, number>; // wordId -> repetitions
  mode: ExamMode;
  questionCount: number;
  levels: (3 | 4 | 5 | 6)[];
  selectedPos: PartOfSpeech[];
  sourcePool: ExamSourcePool;
}

/**
 * Strips diacritic/tone marks, lowercases, and trims whitespace for loose comparison.
 */
export function normalizeForCompare(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '');
}

/**
 * Check if a user answer is correct for a given question.
 */
export function gradeAnswer(question: ExamQuestion, userAnswer: string): boolean {
  if (question.mode === 'mc') {
    // For MC, userAnswer is the index string of the selected option
    const selectedIndex = parseInt(userAnswer, 10);
    return selectedIndex === question.correctOptionIndex;
  }
  // Dictation: accept exact hanzi match or normalized pinyin match
  const trimmed = userAnswer.trim();
  if (trimmed === question.word.hanzi) return true;
  if (normalizeForCompare(trimmed) === normalizeForCompare(question.word.pinyin)) return true;
  return false;
}

/**
 * Pick 3 distractor meanings from the same level if possible, otherwise any level.
 */
function pickDistractors(
  correctWord: VocabWord,
  pool: VocabWord[],
  count: number
): string[] {
  const sameLevel = pool.filter(
    (w) => w.id !== correctWord.id && w.meaning_ko !== correctWord.meaning_ko && w.level === correctWord.level
  );
  const otherLevel = pool.filter(
    (w) => w.id !== correctWord.id && w.meaning_ko !== correctWord.meaning_ko && w.level !== correctWord.level
  );

  const candidates = sameLevel.length >= count ? sameLevel : [...sameLevel, ...otherLevel];
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((w) => w.meaning_ko);
}

/**
 * Shuffle an array in place using Fisher-Yates.
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate a list of exam questions based on options.
 */
export function generateExamQuestions(opts: GenerateExamOptions): ExamQuestion[] {
  const { allWords, cardStudiedMap, mode, questionCount, levels, selectedPos, sourcePool } = opts;

  // Filter by level and POS
  let pool = allWords.filter(
    (w) => levels.includes(w.level) && selectedPos.includes(w.pos)
  );

  // Filter by source pool
  if (sourcePool === 'studied') {
    pool = pool.filter((w) => (cardStudiedMap[w.id] ?? 0) > 0);
  }

  if (pool.length === 0) return [];

  // Sample words for the exam
  const shuffledPool = shuffle(pool);
  const selectedWords = shuffledPool.slice(0, Math.min(questionCount, shuffledPool.length));

  return selectedWords.map((word, idx) => {
    let questionMode: 'mc' | 'dictation';
    if (mode === 'mixed') {
      questionMode = idx % 2 === 0 ? 'mc' : 'dictation';
    } else {
      questionMode = mode === 'mc' ? 'mc' : 'dictation';
    }

    if (questionMode === 'mc') {
      const distractors = pickDistractors(word, allWords, 3);
      const allOptions = shuffle([word.meaning_ko, ...distractors]);
      const correctOptionIndex = allOptions.indexOf(word.meaning_ko);
      return {
        id: `q-${idx}`,
        word,
        mode: 'mc' as const,
        options: allOptions,
        correctOptionIndex,
      };
    }

    return {
      id: `q-${idx}`,
      word,
      mode: 'dictation' as const,
    };
  });
}
