'use client';

import { useEffect, useState, useRef } from 'react';
import NavBar from '@/components/NavBar';
import { useHSKStore } from '@/lib/store';

export default function SettingsPage() {
  const { settings, updateSettings, resetProgress, exportData, importData } = useHSKStore();
  const [mounted, setMounted] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (settings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings.darkMode, mounted]);

  if (!mounted) return null;

  const handleLevelToggle = (level: 3 | 4 | 5 | 6) => {
    const current = settings.enabledLevels;
    const updated = current.includes(level)
      ? current.filter((l) => l !== level)
      : ([...current, level].sort() as (3 | 4 | 5 | 6)[]);
    if (updated.length === 0) return;
    updateSettings({ enabledLevels: updated });
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hsk-master-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const success = importData(text);
      setImportStatus(success ? '✅ 가져오기 성공!' : '❌ 파일 형식 오류');
      setTimeout(() => setImportStatus(''), 3000);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <main className="flex-1 p-4 pb-20">
      <header className="py-4 mb-4">
        <h1 className="text-2xl font-bold">설정</h1>
      </header>

      {/* Daily Limits */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-base font-semibold mb-4">하루 학습량</h2>
        <div className="space-y-4">
          <div>
            <label className="flex justify-between text-sm mb-2">
              <span>신규 단어 (하루)</span>
              <span className="font-bold text-indigo-600">{settings.dailyNewCards}개</span>
            </label>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={settings.dailyNewCards}
              onChange={(e) => updateSettings({ dailyNewCards: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10개</span>
              <span>100개</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-sm mb-2">
              <span>복습 (하루 최대)</span>
              <span className="font-bold text-green-600">{settings.dailyReviews}개</span>
            </label>
            <input
              type="range"
              min={50}
              max={500}
              step={10}
              value={settings.dailyReviews}
              onChange={(e) => updateSettings({ dailyReviews: Number(e.target.value) })}
              className="w-full accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>50개</span>
              <span>500개</span>
            </div>
          </div>
        </div>
      </section>

      {/* Level Selection */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-base font-semibold mb-3">학습 레벨</h2>
        <div className="grid grid-cols-2 gap-2">
          {([3, 4, 5, 6] as const).map((level) => (
            <button
              key={level}
              onClick={() => handleLevelToggle(level)}
              className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                settings.enabledLevels.includes(level)
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              HSK {level}
            </button>
          ))}
        </div>
      </section>

      {/* Dark Mode */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-semibold">다크 모드</h2>
            <p className="text-xs text-gray-500 mt-0.5">화면 밝기 조절</p>
          </div>
          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.darkMode ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Data Management */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-base font-semibold mb-3">데이터 관리</h2>
        <div className="space-y-2">
          <button
            onClick={handleExport}
            className="w-full py-3 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl font-medium text-sm border border-blue-200 dark:border-blue-800"
          >
            📤 데이터 내보내기 (백업)
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl font-medium text-sm border border-green-200 dark:border-green-800"
          >
            📥 데이터 가져오기 (복원)
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          {importStatus && <p className="text-sm text-center py-2">{importStatus}</p>}
        </div>
      </section>

      {/* Reset */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-base font-semibold mb-2 text-red-600">위험 구역</h2>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl font-medium text-sm border border-red-200 dark:border-red-800"
          >
            🗑️ 모든 학습 데이터 초기화
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">
              정말 초기화하시겠어요? 되돌릴 수 없어요!
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm"
              >
                취소
              </button>
              <button
                onClick={handleReset}
                className="py-2 px-4 bg-red-600 text-white rounded-xl text-sm font-bold"
              >
                초기화
              </button>
            </div>
          </div>
        )}
      </section>

      <NavBar />
    </main>
  );
}
