'use client';

import { useState } from 'react';
import type { ExamMode, ExamSourcePool, PartOfSpeech } from '@/lib/types';
import { POS_VALUES, POS_LABELS_KO } from '@/lib/pos';

interface ExamSetupProps {
  initialLevels: (3 | 4 | 5 | 6)[];
  initialPos: PartOfSpeech[];
  studiedWordCount: number;
  onStart: (config: ExamConfig) => void;
}

export interface ExamConfig {
  mode: ExamMode;
  questionCount: number;
  levels: (3 | 4 | 5 | 6)[];
  selectedPos: PartOfSpeech[];
  sourcePool: ExamSourcePool;
}

export default function ExamSetup({ initialLevels, initialPos, studiedWordCount, onStart }: ExamSetupProps) {
  const [mode, setMode] = useState<ExamMode>('mc');
  const [questionCount, setQuestionCount] = useState(20);
  const [levels, setLevels] = useState<(3 | 4 | 5 | 6)[]>(initialLevels);
  const [selectedPos, setSelectedPos] = useState<PartOfSpeech[]>(initialPos);
  const [sourcePool, setSourcePool] = useState<ExamSourcePool>('all');
  const [showPosFilter, setShowPosFilter] = useState(false);

  const toggleLevel = (level: 3 | 4 | 5 | 6) => {
    const updated = levels.includes(level)
      ? levels.filter((l) => l !== level)
      : ([...levels, level].sort() as (3 | 4 | 5 | 6)[]);
    if (updated.length > 0) setLevels(updated);
  };

  const togglePos = (pos: PartOfSpeech) => {
    const updated = selectedPos.includes(pos)
      ? selectedPos.filter((p) => p !== pos)
      : [...selectedPos, pos];
    if (updated.length > 0) setSelectedPos(updated);
  };

  const handleStart = () => {
    onStart({ mode, questionCount, levels, selectedPos, sourcePool });
  };

  const notEnoughStudied = sourcePool === 'studied' && studiedWordCount < 4;

  return (
    <main className="flex-1 p-4 pb-24">
      <header className="py-4 mb-4">
        <h1 className="text-2xl font-bold">모의시험 설정</h1>
      </header>

      {/* Exam Type */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-base font-semibold mb-3">시험 종류</h2>
        <div className="space-y-2">
          {([
            { value: 'mc', label: '객관식', desc: '한자 보고 한국어 뜻 고르기' },
            { value: 'dictation', label: '받아쓰기', desc: '한국어 뜻 보고 한자/병음 입력' },
            { value: 'mixed', label: '혼합', desc: '객관식 + 받아쓰기 섞기' },
          ] as { value: ExamMode; label: string; desc: string }[]).map(({ value, label, desc }) => (
            <label
              key={value}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                mode === value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name="mode"
                value={value}
                checked={mode === value}
                onChange={() => setMode(value)}
                className="accent-indigo-600"
              />
              <div>
                <span className="font-medium text-sm">{label}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Question Count */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-base font-semibold mb-3">문제 수</h2>
        <div className="grid grid-cols-4 gap-2">
          {[10, 20, 50, 100].map((n) => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                questionCount === n
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
              }`}
            >
              {n}문제
            </button>
          ))}
        </div>
      </section>

      {/* Level Selection */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-base font-semibold mb-3">HSK 레벨</h2>
        <div className="grid grid-cols-4 gap-2">
          {([3, 4, 5, 6] as const).map((level) => (
            <button
              key={level}
              onClick={() => toggleLevel(level)}
              className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                levels.includes(level)
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'
              }`}
            >
              HSK {level}
            </button>
          ))}
        </div>
      </section>

      {/* POS Filter */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setShowPosFilter(!showPosFilter)}
        >
          <h2 className="text-base font-semibold">품사 필터</h2>
          <span className="text-xs text-gray-500">
            {selectedPos.length === POS_VALUES.length ? '전체' : `${selectedPos.length}개 선택`} {showPosFilter ? '▲' : '▼'}
          </span>
        </button>
        {showPosFilter && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              className="col-span-2 text-xs text-indigo-600 dark:text-indigo-400 text-right"
              onClick={() =>
                selectedPos.length === POS_VALUES.length
                  ? setSelectedPos([POS_VALUES[0]])
                  : setSelectedPos([...POS_VALUES])
              }
            >
              {selectedPos.length === POS_VALUES.length ? '전체 해제' : '전체 선택'}
            </button>
            {POS_VALUES.map((pos) => (
              <label key={pos} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPos.includes(pos)}
                  onChange={() => togglePos(pos)}
                  className="accent-indigo-600"
                />
                {POS_LABELS_KO[pos]}
              </label>
            ))}
          </div>
        )}
      </section>

      {/* Source Pool */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-base font-semibold mb-3">출제 범위</h2>
        <div className="space-y-2">
          {([
            { value: 'all', label: '전체 단어', desc: '선택한 레벨의 모든 단어' },
            { value: 'studied', label: '학습한 단어만', desc: '복습한 적 있는 단어만' },
          ] as { value: ExamSourcePool; label: string; desc: string }[]).map(({ value, label, desc }) => (
            <label
              key={value}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                sourcePool === value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name="sourcePool"
                value={value}
                checked={sourcePool === value}
                onChange={() => setSourcePool(value)}
                className="accent-indigo-600"
              />
              <div>
                <span className="font-medium text-sm">{label}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            </label>
          ))}
        </div>
        {notEnoughStudied && (
          <p className="mt-3 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl">
            학습한 단어가 {studiedWordCount}개밖에 없어요. &apos;전체 단어&apos;를 선택하거나 더 학습한 후 시도해주세요.
          </p>
        )}
      </section>

      <button
        onClick={handleStart}
        disabled={notEnoughStudied}
        className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
      >
        시험 시작 🚀
      </button>
    </main>
  );
}
