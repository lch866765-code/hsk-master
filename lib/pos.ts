export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'numeral'
  | 'measure'
  | 'preposition'
  | 'conjunction'
  | 'particle'
  | 'interjection'
  | 'onomatopoeia'
  | 'idiom'
  | 'other';

export const POS_VALUES: readonly PartOfSpeech[] = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'numeral',
  'measure',
  'preposition',
  'conjunction',
  'particle',
  'interjection',
  'onomatopoeia',
  'idiom',
  'other',
];

export const POS_LABELS_KO: Record<PartOfSpeech, string> = {
  noun: '명사',
  verb: '동사',
  adjective: '형용사',
  adverb: '부사',
  pronoun: '대명사',
  numeral: '수사',
  measure: '양사',
  preposition: '전치사',
  conjunction: '접속사',
  particle: '조사',
  interjection: '감탄사',
  onomatopoeia: '의성어',
  idiom: '성어',
  other: '기타',
};

export const POS_COLORS: Record<PartOfSpeech, string> = {
  noun: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  verb: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  adjective: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
  adverb: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
  pronoun: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200',
  numeral: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
  measure: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200',
  preposition: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
  conjunction: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  particle: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  interjection: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
  onomatopoeia: 'bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-200',
  idiom: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  other: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
};

export const POS_ABBR_ZH: Record<PartOfSpeech, string> = {
  noun: '名',
  verb: '动',
  adjective: '形',
  adverb: '副',
  pronoun: '代',
  numeral: '数',
  measure: '量',
  preposition: '介',
  conjunction: '连',
  particle: '助',
  interjection: '叹',
  onomatopoeia: '拟',
  idiom: '成',
  other: '—',
};
