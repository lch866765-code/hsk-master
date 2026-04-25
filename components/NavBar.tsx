'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/study', label: '학습', icon: '📚' },
  { href: '/exam', label: '모의시험', icon: '📝' },
  { href: '/stats', label: '통계', icon: '📊' },
  { href: '/settings', label: '설정', icon: '⚙️' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-lg mx-auto flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center py-3 min-h-[56px] text-xs transition-colors ${
              pathname === item.href
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
