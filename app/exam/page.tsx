'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import ExamSetup, { type ExamConfig } from '@/components/ExamSetup';
import ExamQuestionUI from '@/components/ExamQuestion';
import ExamResults from '@/components/ExamResults';
import { useHSKStore } from '@/lib/store';
import { generateExamQuestions } from '@/lib/exam';
import { useMounted } from '@/lib/useMounted';
import { createInitialCardState } from '@/lib/srs';
import type { VocabWord, ExamQuestion, ExamResult, ExamMode } from '@/lib/types';

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

type ExamScreen = 'setup' | 'question' | 'results';

export default function ExamPage() {
  const router = useRouter();
  const { cards, settings, addExamResult, updateCard } = useHSKStore();
  const mounted = useMounted();

  const [screen, setScreen] = useState<ExamScreen>('setup');
  const [allWords, setAllWords] = useState<VocabWord[]>([]);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongWordIds, setWrongWordIds] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [examMode, setExamMode] = useState<ExamMode>('mc');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [lastConfig, setLastConfig] = useState<ExamConfig | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Load all words for all levels on mount
  useEffect(() => {
    loadAllWords([3, 4, 5, 6]).then(setAllWords);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    startTimeRef.current = Date.now();
    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const studiedWordCount = Object.values(cards).filter((c) => c.repetitions > 0).length;

  const handleStart = useCallback(
    (config: ExamConfig) => {
      setLastConfig(config);
      setExamMode(config.mode);

      const cardStudiedMap: Record<string, number> = {};
      Object.entries(cards).forEach(([id, card]) => {
        cardStudiedMap[id] = card.repetitions;
      });

      const generated = generateExamQuestions({
        allWords,
        cardStudiedMap,
        mode: config.mode,
        questionCount: config.questionCount,
        levels: config.levels,
        selectedPos: config.selectedPos,
        sourcePool: config.sourcePool,
      });

      if (generated.length === 0) return;

      setQuestions(generated);
      setCurrentIndex(0);
      setWrongWordIds([]);
      setCorrectCount(0);
      setExamResult(null);
      setScreen('question');
      startTimer();
    },
    [allWords, cards, startTimer]
  );

  const handleAnswer = useCallback(
    (correct: boolean) => {
      const question = questions[currentIndex];
      if (!question) return;

      if (!correct) {
        setWrongWordIds((prev) => [...prev, question.word.id]);
      } else {
        setCorrectCount((prev) => prev + 1);
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        // Exam complete
        stopTimer();
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const wrongIds = correct
          ? wrongWordIds
          : [...wrongWordIds, question.word.id];
        const correctFinal = correct ? correctCount + 1 : correctCount;

        const result: ExamResult = {
          id: `exam-${Date.now()}`,
          date: new Date().toISOString(),
          mode: examMode,
          totalQuestions: questions.length,
          correctCount: correctFinal,
          elapsedSeconds: elapsed,
          wrongWordIds: wrongIds,
          levels: lastConfig?.levels ?? [3, 4],
        };

        addExamResult(result);
        setExamResult(result);
        setScreen('results');
      } else {
        setCurrentIndex(nextIndex);
      }
    },
    [questions, currentIndex, correctCount, wrongWordIds, examMode, lastConfig, stopTimer, addExamResult]
  );

  const handleSkip = useCallback(() => {
    handleAnswer(false);
  }, [handleAnswer]);

  const handleResetWord = useCallback(
    (wordId: string) => {
      const existing = cards[wordId] ?? createInitialCardState(wordId);
      updateCard({
        ...existing,
        interval: 0,
        dueDate: new Date().toISOString(),
        state: 'new',
      });
    },
    [cards, updateCard]
  );

  const handleRestart = useCallback(() => {
    if (lastConfig) {
      handleStart(lastConfig);
    } else {
      setScreen('setup');
    }
  }, [lastConfig, handleStart]);

  if (!mounted) return null;

  if (screen === 'question') {
    const question = questions[currentIndex];
    if (!question) return null;
    return (
      <>
        <ExamQuestionUI
          question={question}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          elapsedSeconds={elapsedSeconds}
          onAnswer={handleAnswer}
          onSkip={handleSkip}
        />
        <NavBar />
      </>
    );
  }

  if (screen === 'results' && examResult) {
    return (
      <>
        <ExamResults
          result={examResult}
          mode={examMode}
          questions={questions}
          onRestart={handleRestart}
          onHome={() => router.push('/')}
          onResetWord={handleResetWord}
        />
        <NavBar />
      </>
    );
  }

  return (
    <>
      <ExamSetup
        initialLevels={settings.enabledLevels}
        initialPos={settings.selectedPos}
        studiedWordCount={studiedWordCount}
        onStart={handleStart}
      />
      <NavBar />
    </>
  );
}
