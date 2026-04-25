'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import ProgressBar from '@/components/ProgressBar';
import { useHSKStore } from '@/lib/store';
import { isDueToday } from '@/lib/srs';
import type { VocabWord } from '@/lib/types';

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

export default function HomePage() {
  const { cards, settings, todayNewCount, todayReviewCount, initializeCards, resetTodayCounts } =
    useHSKStore();
  const [allWords, setAllWords] = useState<VocabWord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    resetTodayCounts();
    loadAllWords(settings.enabledLevels).then((words) => {
      setAllWords(words);
      initializeCards(words);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.enabledLevels.join(',')]);

  if (!mounted) return null;

  const allCardStates = Object.values(cards);
  const dueReviews = allCardStates.filter(
    (c) => c.state === 'review' && isDueToday(c)
  ).length;
  const newCardCount = allCardStates.filter((c) => c.state === 'new').length;
  const learnedCards = allCardStates.filter((c) => c.repetitions > 0).length;
  const remainingNew = Math.max(0, settings.dailyNewCards - todayNewCount);

  const levelStats = ([3, 4, 5, 6] as const).map((level) => {
    const levelWords = allWords.filter((w) => w.level === level);
    const levelLearned = levelWords.filter(
      (w) => cards[w.id] && cards[w.id].repetitions > 0
    ).length;
    return { level, total: levelWords.length, learned: levelLearned };
  });

  const hasPendingStudy = dueReviews > 0 || (newCardCount > 0 && remainingNew > 0);

  return (
    <main className="flex-1 p-4 pb-20">
      <header className="py-4 mb-4">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">HSK Master</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">오늘도 화이팅! 💪</p>
      </header>

      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-base font-semibold mb-3">오늘의 학습</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">신규 단어</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {todayNewCount}
              <span className="text-sm text-gray-400 font-normal">/{settings.dailyNewCards}</span>
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">복습</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {todayReviewCount}
              <span className="text-sm text-gray-400 font-normal">/{settings.dailyReviews}</span>
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-amber-600 dark:text-amber-400">⏰ 복습 대기: {dueReviews}개</span>
            <span className="text-blue-600 dark:text-blue-400">🆕 신규 가능: {remainingNew}개</span>
          </div>
        </div>
      </section>

      <Link
        href="/study"
        className={`w-full block text-center py-4 px-6 rounded-2xl text-lg font-bold text-white shadow-md transition-all mb-4 ${
          hasPendingStudy
            ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            : 'bg-gray-400'
        }`}
      >
        {hasPendingStudy ? '�� 학습 시작' : '✅ 오늘 학습 완료!'}
      </Link>

      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-base font-semibold mb-3">레벨별 진행도</h2>
        <div className="space-y-3">
          {levelStats.map(({ level, total, learned }) => (
            <ProgressBar
              key={level}
              label={`HSK ${level}`}
              value={learned}
              max={total}
              color={
                level === 3
                  ? 'bg-green-500'
                  : level === 4
                  ? 'bg-blue-500'
                  : level === 5
                  ? 'bg-purple-500'
                  : 'bg-red-500'
              }
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          전체: {learnedCards}개 학습 완료
        </p>
      </section>
      <NavBar />
    </main>
  );
}
