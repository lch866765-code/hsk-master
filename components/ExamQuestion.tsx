'use client';

import { useState, useEffect, useRef } from 'react';
import type { ExamQuestion } from '@/lib/types';
import { gradeAnswer } from '@/lib/exam';
import { speakChinese, isTTSSupported } from '@/lib/tts';
import { POS_LABELS_KO, POS_COLORS } from '@/lib/pos';

interface ExamQuestionProps {
  question: ExamQuestion;
  questionNumber: number;
  totalQuestions: number;
  elapsedSeconds: number;
  onAnswer: (correct: boolean) => void;
  onSkip: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분 ${s.toString().padStart(2, '0')}초`;
}

export default function ExamQuestionUI({
  question,
  questionNumber,
  totalQuestions,
  elapsedSeconds,
  onAnswer,
  onSkip,
}: ExamQuestionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [textInput, setTextInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [ttsSupported] = useState(() => isTTSSupported());
  const inputRef = useRef<HTMLInputElement>(null);

  const progress = ((questionNumber - 1) / totalQuestions) * 100;

  // Auto-advance after MC selection (2 seconds); runs only after user picks an option
  useEffect(() => {
    if (selectedIndex === null) return;
    const timer = setTimeout(() => onAnswer(isCorrect), 2000);
    return () => clearTimeout(timer);
  }, [selectedIndex, isCorrect, onAnswer]);

  // Auto-focus dictation input when a new dictation question loads
  useEffect(() => {
    if (question.mode === 'dictation') {
      inputRef.current?.focus();
    }
  }, [question.mode]);

  const handleMCSelect = (index: number) => {
    if (submitted) return;
    setSelectedIndex(index);
    const correct = gradeAnswer(question, String(index));
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleDictationSubmit = () => {
    if (submitted) return;
    const correct = gradeAnswer(question, textInput);
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  return (
    <main className="flex-1 p-4 pb-24">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{questionNumber} / {totalQuestions}</span>
          <span>⏱ {formatTime(elapsedSeconds)}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-indigo-500 uppercase tracking-wider">
            HSK {question.word.level} · {question.mode === 'mc' ? '객관식' : '받아쓰기'}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${POS_COLORS[question.word.pos]}`}>
            {POS_LABELS_KO[question.word.pos]}
          </span>
        </div>

        {question.mode === 'mc' ? (
          <>
            <div className="chinese-text text-6xl font-bold text-gray-900 dark:text-white text-center mb-4">
              {question.word.hanzi}
            </div>
            {ttsSupported && (
              <button
                onClick={() => speakChinese(question.word.hanzi)}
                className="mx-auto flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm"
              >
                🔊 발음 듣기
              </button>
            )}
          </>
        ) : (
          <div className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            {question.word.meaning_ko}
          </div>
        )}

        {/* Feedback after submit */}
        {submitted && (
          <div className={`mt-4 p-3 rounded-xl text-sm text-center font-medium ${
            isCorrect
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            {isCorrect ? '✅ 정답!' : `❌ 오답 — 정답: ${question.word.hanzi} (${question.word.pinyin}) · ${question.word.meaning_ko}`}
          </div>
        )}
      </div>

      {/* MC Options */}
      {question.mode === 'mc' && question.options && (
        <div className="space-y-2 mb-4">
          {question.options.map((opt, idx) => {
            let btnClass = 'w-full py-4 px-4 rounded-xl border-2 text-left font-medium transition-all min-h-[56px]';
            if (!submitted) {
              btnClass += ' border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-indigo-400';
            } else if (idx === question.correctOptionIndex) {
              btnClass += ' border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
            } else if (idx === selectedIndex && !isCorrect) {
              btnClass += ' border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
            } else {
              btnClass += ' border-gray-200 dark:border-gray-600 opacity-50';
            }
            return (
              <button key={idx} className={btnClass} onClick={() => handleMCSelect(idx)}>
                <span className="text-xs text-gray-400 mr-2">{['①', '②', '③', '④'][idx]}</span>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* MC Next button after selection */}
      {question.mode === 'mc' && submitted && (
        <button
          onClick={handleNext}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-700 transition-colors mb-4"
        >
          다음 →
        </button>
      )}

      {/* Dictation Input */}
      {question.mode === 'dictation' && (
        <div className="mb-4">
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleDictationSubmit(); }}
            readOnly={submitted}
            placeholder="한자를 입력하세요"
            className="w-full px-4 py-3 text-2xl text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 chinese-text"
            aria-label="한자 입력"
          />
          {!submitted && (
            <button
              onClick={handleDictationSubmit}
              className="w-full mt-2 py-4 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-700 transition-colors"
            >
              정답 확인
            </button>
          )}
          {submitted && (
            <button
              onClick={handleNext}
              className="w-full mt-2 py-4 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-700 transition-colors"
            >
              다음 →
            </button>
          )}
        </div>
      )}

      {/* Skip button */}
      {!submitted && (
        <button
          onClick={onSkip}
          className="w-full py-3 text-gray-500 dark:text-gray-400 text-sm underline"
        >
          건너뛰기 (오답 처리)
        </button>
      )}
    </main>
  );
}
