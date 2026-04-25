'use client';

import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import { useHSKStore } from '@/lib/store';
import { isDueToday } from '@/lib/srs';
import { useMounted } from '@/lib/useMounted';
import { POS_VALUES, POS_LABELS_KO } from '@/lib/pos';
import type { VocabWord, ExamMode } from '@/lib/types';

const MODE_LABELS: Record<ExamMode, string> = {
  mc: '객관식',
  dictation: '받아쓰기',
  mixed: '혼합',
};

async function loadAllWords(levels: (3 | 4 | 5 | 6)[]): Promise<VocabWord[]> {
  const results: VocabWord[] = [];
  for (const level of levels) {
    let data: VocabWord[] = [];
    if (level === 3) {
      const m = await import('@/data/hsk3.json');
      data = m.default as VocabWord[];
    } else if (level === 4) {
      const m = await import('@/data/hsk4.json');
      data = m.default as VocabWord[];
    } else if (level === 5) {
      const m = await import('@/data/hsk5.json');
      data = m.default as VocabWord[];
    } else if (level === 6) {
      const m = await import('@/data/hsk6.json');
      data = m.default as VocabWord[];
    }
    results.push(...data);
  }
  return results;
}

export default function StatsPage() {
  const { cards, sessions, settings, examHistory } = useHSKStore();
  const [allWords, setAllWords] = useState<VocabWord[]>([]);
  const mounted = useMounted();

  const levelsKey = settings.enabledLevels.join(',');

  useEffect(() => {
    loadAllWords(settings.enabledLevels).then(setAllWords);
  // levelsKey is a stable dep representing settings.enabledLevels
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelsKey]);

  if (!mounted) return null;

  const allCardStates = Object.values(cards);
  const totalLearned = allCardStates.filter((c) => c.repetitions > 0).length;
  const totalDue = allCardStates.filter((c) => isDueToday(c) && c.state !== 'new').length;
  const totalCards = allCardStates.length;

  const reviewed = allCardStates.filter((c) => c.repetitions > 0);
  const retentionRate =
    reviewed.length > 0
      ? Math.round((reviewed.filter((c) => c.lapses === 0).length / reviewed.length) * 100)
      : 0;

  let streak = 0;
  if (sessions.length > 0) {
    const dates = [...new Set(sessions.map((s) => new Date(s.date).toDateString()))].sort().reverse();
    for (let i = 0; i < dates.length; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (dates[i] === d.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
  }

  const levelStats = ([3, 4, 5, 6] as const).map((level) => {
    const levelWords = allWords.filter((w) => w.level === level);
    const levelCards = levelWords.map((w) => cards[w.id]).filter(Boolean);
    const learned = levelCards.filter((c) => c.repetitions > 0).length;
    return { level, total: levelWords.length, learned };
  });

  // POS breakdown (for all loaded words)
  const posStats = POS_VALUES.map((pos) => {
    const posWords = allWords.filter((w) => w.pos === pos);
    const learned = posWords.filter((w) => (cards[w.id]?.repetitions ?? 0) > 0).length;
    return { pos, total: posWords.length, learned };
  }).filter(({ total }) => total > 0);

  const recentExams = (examHistory ?? []).slice(0, 5);

  return (
    <main className="flex-1 p-4 pb-20">
      <header className="py-4 mb-4">
        <h1 className="text-2xl font-bold">통계</h1>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">학습 완료</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{totalLearned}</p>
          <p className="text-xs text-gray-400">/ {totalCards}개</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">오늘 복습 대기</p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{totalDue}</p>
          <p className="text-xs text-gray-400">단어</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">정답률</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{retentionRate}%</p>
          <p className="text-xs text-gray-400">보유율</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">연속 학습</p>
          <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">{streak}</p>
          <p className="text-xs text-gray-400">일 연속 🔥</p>
        </div>
      </div>

      {/* Level stats */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-base font-semibold mb-3">레벨별 통계</h2>
        <div className="space-y-3">
          {levelStats.map(({ level, total, learned }) => (
            <div key={level} className="flex items-center gap-3">
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  level === 3
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : level === 4
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : level === 5
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                HSK {level}
              </span>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    {learned}/{total}개
                  </span>
                  <span className="text-gray-400">
                    {total > 0 ? Math.round((learned / total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      level === 3
                        ? 'bg-green-500'
                        : level === 4
                        ? 'bg-blue-500'
                        : level === 5
                        ? 'bg-purple-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${total > 0 ? (learned / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POS breakdown */}
      {posStats.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
          <h2 className="text-base font-semibold mb-3">품사별 학습 단어 수</h2>
          <div className="flex flex-wrap gap-2">
            {posStats.map(({ pos, total, learned }) => (
              <div
                key={pos}
                className="text-xs px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">{POS_LABELS_KO[pos]}</span>
                <span className="ml-1 text-indigo-600 dark:text-indigo-400 font-bold">{learned}</span>
                <span className="text-gray-400">/{total}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Exam history */}
      {recentExams.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
          <h2 className="text-base font-semibold mb-3">모의시험 기록</h2>
          <div className="space-y-2">
            {recentExams.map((exam) => {
              const score = Math.round((exam.correctCount / exam.totalQuestions) * 100);
              const date = new Date(exam.date).toLocaleDateString('ko-KR', {
                month: '2-digit',
                day: '2-digit',
              });
              return (
                <div
                  key={exam.id}
                  className="flex items-center justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    {date} · {MODE_LABELS[exam.mode]} · {exam.totalQuestions}문제
                  </span>
                  <span
                    className={`font-bold ${
                      score >= 80
                        ? 'text-green-600 dark:text-green-400'
                        : score >= 60
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {score}점 ({exam.correctCount}/{exam.totalQuestions})
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <NavBar />
    </main>
  );
}
