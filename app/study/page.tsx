'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Flashcard from '@/components/Flashcard';
import RatingButtons from '@/components/RatingButtons';
import NavBar from '@/components/NavBar';
import { useHSKStore } from '@/lib/store';
import { calculateNextInterval, isDueToday, getIntervalPreview } from '@/lib/srs';
import type { VocabWord, Rating } from '@/lib/types';

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

export default function StudyPage() {
  const router = useRouter();
  const {
    cards,
    settings,
    todayNewCount,
    todayReviewCount,
    updateCard,
    initializeCards,
    incrementTodayNew,
    incrementTodayReview,
  } = useHSKStore();

  const [allWords, setAllWords] = useState<VocabWord[]>([]);
  const [studyQueue, setStudyQueue] = useState<VocabWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadAllWords(settings.enabledLevels).then((words) => {
      setAllWords(words);
      initializeCards(words);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildStudyQueue = useCallback(() => {
    if (allWords.length === 0) return;

    const now = new Date();

    const dueReviews = allWords.filter((w) => {
      const card = cards[w.id];
      return card && card.state === 'review' && new Date(card.dueDate) <= now;
    });

    const learningCards = allWords.filter((w) => {
      const card = cards[w.id];
      return card && card.state === 'learning' && new Date(card.dueDate) <= now;
    });

    const remainingNew = Math.max(0, settings.dailyNewCards - todayNewCount);
    const newCards = allWords
      .filter((w) => {
        const card = cards[w.id];
        return card && card.state === 'new';
      })
      .slice(0, remainingNew);

    const queue = [...learningCards, ...dueReviews, ...newCards];

    if (queue.length === 0) {
      setSessionComplete(true);
    } else {
      setStudyQueue(queue);
      setCurrentIndex(0);
      setShowRating(false);
    }
  }, [allWords, cards, settings.dailyNewCards, todayNewCount]);

  useEffect(() => {
    if (allWords.length > 0) {
      buildStudyQueue();
    }
  }, [allWords, buildStudyQueue]);

  const handleCardFlip = useCallback(() => {
    setShowRating(true);
  }, []);

  const handleRate = useCallback(
    (rating: Rating) => {
      const currentWord = studyQueue[currentIndex];
      if (!currentWord) return;

      const currentCard = cards[currentWord.id];
      if (!currentCard) return;

      const updatedCard = calculateNextInterval(currentCard, rating);
      updateCard(updatedCard);

      if (currentCard.state === 'new') {
        incrementTodayNew();
      } else if (currentCard.state === 'review') {
        incrementTodayReview();
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex >= studyQueue.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex(nextIndex);
        setShowRating(false);
      }
    },
    [studyQueue, currentIndex, cards, updateCard, incrementTodayNew, incrementTodayReview]
  );

  if (!mounted) return null;

  const currentWord = studyQueue[currentIndex];
  const currentCard = currentWord ? cards[currentWord.id] : null;
  const intervalPreview = currentCard
    ? getIntervalPreview(currentCard)
    : { again: '-', hard: '-', good: '-', easy: '-' };

  if (sessionComplete || !currentWord) {
    return (
      <main className="flex-1 p-4 pb-20 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">세션 완료!</h2>
          <p className="text-gray-500 dark:text-gray-400">
            오늘의 학습을 완료했어요. 내일 또 만나요!
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">신규 단어</p>
              <p className="text-xl font-bold text-indigo-600">{todayNewCount}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">복습</p>
              <p className="text-xl font-bold text-green-600">{todayReviewCount}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold"
          >
            홈으로 돌아가기
          </button>
        </div>
        <NavBar />
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 pb-20 flex flex-col">
      <div className="flex justify-between items-center mb-4 text-sm">
        <button onClick={() => router.back()} className="p-2 text-gray-500">
          ← 뒤로
        </button>
        <span className="text-gray-500 dark:text-gray-400">
          신규: {todayNewCount}/{settings.dailyNewCards} &nbsp;|&nbsp; 복습: {todayReviewCount}/
          {settings.dailyReviews}
        </span>
        <span className="text-gray-400 text-xs">
          {currentIndex + 1}/{studyQueue.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4">
        <Flashcard key={currentWord.id} word={currentWord} autoPlay={true} onFlip={handleCardFlip} />

        {showRating ? (
          <RatingButtons onRate={handleRate} intervalPreview={intervalPreview} />
        ) : (
          <button
            onClick={handleCardFlip}
            className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-medium border border-gray-200 dark:border-gray-700"
          >
            카드 뒤집기 👆
          </button>
        )}
      </div>

      <NavBar />
    </main>
  );
}
