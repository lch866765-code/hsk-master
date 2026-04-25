import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HSK Master - HSK 단어 암기',
  description: 'SRS 방식으로 HSK 3-6 중국어 단어를 효율적으로 암기하세요',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HSK Master',
  },
  icons: {
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#6366f1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-lg mx-auto min-h-screen flex flex-col">
          {children}
        </div>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const stored = localStorage.getItem('hsk-master-state');
              if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.state && parsed.state.settings && parsed.state.settings.darkMode) {
                  document.documentElement.classList.add('dark');
                }
              }
            } catch(e) {}
          `
        }} />
      </body>
    </html>
  );
}
