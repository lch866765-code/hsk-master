'use client';

import { useState, useEffect } from 'react';
import type { VocabWord } from '@/lib/types';
import { speakChinese, isTTSSupported } from '@/lib/tts';
import { POS_LABELS_KO, POS_COLORS } from '@/lib/pos';

interface FlashcardProps {
  word: VocabWord;
  autoPlay?: boolean;
  onFlip?: () => void;
}

export default function Flashcard({ word, autoPlay = true, onFlip }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  // Lazy initializer runs only on mount (client-side), avoiding SSR mismatch
  const [ttsSupported] = useState(() => isTTSSupported());

  // Auto-speak when word changes; parent passes key={word.id} so component remounts
  // which resets isFlipped to false without needing a setState call in the effect.
  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        speakChinese(word.hanzi);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [word.id, autoPlay, word.hanzi]);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    if (!isFlipped && onFlip) {
      onFlip();
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakChinese(word.hanzi);
  };

  const posBadge = (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${POS_COLORS[word.pos]}`}>
      {POS_LABELS_KO[word.pos]}
    </span>
  );

  return (
    <div className="flip-card w-full h-72 cursor-pointer" onClick={handleFlip}>
      <div className={`flip-card-inner w-full h-full ${isFlipped ? 'flip-card-inner-flipped' : ''}`}>
        {/* Front */}
        <div className="flip-card-face bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700 relative">
          <div className="absolute top-3 right-3">
            {posBadge}
          </div>
          <span className="text-xs font-medium text-indigo-500 mb-4 uppercase tracking-wider">
            HSK {word.level}
          </span>
          <div className="chinese-text text-7xl font-bold text-gray-900 dark:text-white mb-4">
            {word.hanzi}
          </div>
          {ttsSupported && (
            <button
              onClick={handleSpeak}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              aria-label="발음 듣기"
            >
              🔊 <span>발음 듣기</span>
            </button>
          )}
          <p className="mt-4 text-gray-400 dark:text-gray-500 text-sm">탭하여 뒤집기</p>
        </div>

        {/* Back */}
        <div className="flip-card-face flip-card-back-face bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700 relative">
          <div className="absolute top-3 right-3">
            {posBadge}
          </div>
          <div className="chinese-text text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {word.hanzi}
          </div>
          <div className="text-indigo-600 dark:text-indigo-400 text-xl font-medium mb-2">
            {word.pinyin}
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
            {word.meaning_ko}
          </div>
          {(word.example_zh || word.example_ko) && (
            <div className="w-full border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
              <p className="chinese-text text-sm text-gray-600 dark:text-gray-400 text-center">
                {word.example_zh}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
                {word.example_ko}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

