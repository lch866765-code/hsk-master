import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CardState, AppSettings, StudySession, VocabWord, ExamResult } from './types';
import { createInitialCardState } from './srs';
import { POS_VALUES } from './pos';

interface HSKStore {
  cards: Record<string, CardState>;
  settings: AppSettings;
  sessions: StudySession[];
  todayNewCount: number;
  todayReviewCount: number;
  lastStudyDate: string;
  examHistory: ExamResult[];

  initializeCards: (words: VocabWord[]) => void;
  updateCard: (card: CardState) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  recordSession: (session: StudySession) => void;
  incrementTodayNew: () => void;
  incrementTodayReview: () => void;
  resetTodayCounts: () => void;
  resetProgress: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  addExamResult: (result: ExamResult) => void;
}

const defaultSettings: AppSettings = {
  dailyNewCards: 30,
  dailyReviews: 200,
  enabledLevels: [3, 4],
  darkMode: false,
  selectedPos: [...POS_VALUES],
};

export const useHSKStore = create<HSKStore>()(
  persist(
    (set, get) => ({
      cards: {},
      settings: defaultSettings,
      sessions: [],
      todayNewCount: 0,
      todayReviewCount: 0,
      lastStudyDate: '',
      examHistory: [],

      initializeCards: (words: VocabWord[]) => {
        const { cards } = get();
        const newCards = { ...cards };
        let added = false;

        words.forEach((word) => {
          if (!newCards[word.id]) {
            newCards[word.id] = createInitialCardState(word.id);
            added = true;
          }
        });

        if (added) {
          set({ cards: newCards });
        }
      },

      updateCard: (card: CardState) => {
        set((state) => ({
          cards: { ...state.cards, [card.wordId]: card },
        }));
      },

      updateSettings: (newSettings: Partial<AppSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      recordSession: (session: StudySession) => {
        set((state) => ({
          sessions: [...state.sessions, session],
        }));
      },

      incrementTodayNew: () => {
        const today = new Date().toDateString();
        const { lastStudyDate, todayNewCount } = get();

        if (lastStudyDate !== today) {
          set({ todayNewCount: 1, todayReviewCount: 0, lastStudyDate: today });
        } else {
          set({ todayNewCount: todayNewCount + 1 });
        }
      },

      incrementTodayReview: () => {
        const today = new Date().toDateString();
        const { lastStudyDate, todayReviewCount } = get();

        if (lastStudyDate !== today) {
          set({ todayNewCount: 0, todayReviewCount: 1, lastStudyDate: today });
        } else {
          set({ todayReviewCount: todayReviewCount + 1 });
        }
      },

      resetTodayCounts: () => {
        const today = new Date().toDateString();
        const { lastStudyDate } = get();

        if (lastStudyDate !== today) {
          set({ todayNewCount: 0, todayReviewCount: 0, lastStudyDate: today });
        }
      },

      resetProgress: () => {
        set({
          cards: {},
          sessions: [],
          todayNewCount: 0,
          todayReviewCount: 0,
          lastStudyDate: '',
        });
      },

      exportData: () => {
        const state = get();
        return JSON.stringify(
          {
            cards: state.cards,
            sessions: state.sessions,
            settings: state.settings,
            todayNewCount: state.todayNewCount,
            todayReviewCount: state.todayReviewCount,
            lastStudyDate: state.lastStudyDate,
            examHistory: state.examHistory,
          },
          null,
          2
        );
      },

      importData: (json: string): boolean => {
        try {
          const data = JSON.parse(json) as Partial<HSKStore>;
          set({
            cards: data.cards ?? {},
            sessions: data.sessions ?? [],
            settings: {
              ...defaultSettings,
              ...(data.settings ?? {}),
              selectedPos: data.settings?.selectedPos ?? [...POS_VALUES],
            },
            todayNewCount: data.todayNewCount ?? 0,
            todayReviewCount: data.todayReviewCount ?? 0,
            lastStudyDate: data.lastStudyDate ?? '',
            examHistory: data.examHistory ?? [],
          });
          return true;
        } catch {
          return false;
        }
      },

      addExamResult: (result: ExamResult) => {
        set((state) => ({
          examHistory: [result, ...state.examHistory].slice(0, 20),
        }));
      },
    }),
    {
      name: 'hsk-master-state',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<HSKStore>;
        return {
          ...currentState,
          ...persisted,
          settings: {
            ...defaultSettings,
            ...(persisted.settings ?? {}),
            selectedPos: persisted.settings?.selectedPos ?? [...POS_VALUES],
          },
          examHistory: persisted.examHistory ?? [],
        };
      },
    }
  )
);
