'use client';

import { useState } from 'react';
import type { ExamResult, ExamQuestion, ExamMode } from '@/lib/types';
import { speakChinese, isTTSSupported } from '@/lib/tts';

interface ExamResultsProps {
  result: ExamResult;
  mode: ExamMode;
  questions: ExamQuestion[];
  onRestart: () => void;
  onHome: () => void;
  onResetWord: (wordId: string) => void;
}

const MODE_LABELS: Record<ExamMode, string> = {
  mc: '객관식',
  dictation: '받아쓰기',
  mixed: '혼합',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분 ${s.toString().padStart(2, '0')}초`;
}

export default function ExamResults({
  result,
  mode,
  questions,
  onRestart,
  onHome,
  onResetWord,
}: ExamResultsProps) {
  const [ttsSupported] = useState(() => isTTSSupported());
  const score = Math.round((result.correctCount / result.totalQuestions) * 100);
  const wrongQuestions = questions.filter((q) => result.wrongWordIds.includes(q.word.id));

  const scoreColor =
    score >= 80
      ? 'text-green-600 dark:text-green-400'
      : score >= 60
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-red-600 dark:text-red-400';

  return (
    <main className="flex-1 p-4 pb-24">
      <header className="py-4 mb-4 text-center">
        <h1 className="text-2xl font-bold">시험 결과</h1>
      </header>

      {/* Score */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4 border border-gray-100 dark:border-gray-700 text-center">
        <div className={`text-7xl font-bold mb-2 ${scoreColor}`}>{score}점</div>
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
          정답: {result.correctCount} / {result.totalQuestions}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          소요 시간: {formatTime(result.elapsedSeconds)} · {MODE_LABELS[mode]}
        </div>
      </div>

      {/* Wrong words */}
      {wrongQuestions.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
          <h2 className="text-base font-semibold mb-3">틀린 단어 ({wrongQuestions.length}개)</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {wrongQuestions.map((q) => (
              <div
                key={q.word.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="chinese-text text-xl font-bold text-gray-900 dark:text-white">
                      {q.word.hanzi}
                    </span>
                    {ttsSupported && (
                      <button
                        onClick={() => speakChinese(q.word.hanzi)}
                        className="text-indigo-500 text-sm"
                        aria-label="발음 듣기"
                      >
                        🔊
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-indigo-500">{q.word.pinyin}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{q.word.meaning_ko}</div>
                </div>
                <button
                  onClick={() => onResetWord(q.word.id)}
                  className="ml-2 text-xs px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-800"
                >
                  다시 학습
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action buttons */}
      <div className="space-y-2">
        <button
          onClick={onRestart}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-base hover:bg-indigo-700 transition-colors"
        >
          다시 시험 🔄
        </button>
        <button
          onClick={onHome}
          className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-base"
        >
          홈으로 🏠
        </button>
      </div>
    </main>
  );
}
