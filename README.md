# HSK Master 📚

SRS(간격 반복) 방식으로 HSK 3-6급 중국어 단어를 효율적으로 암기하는 PWA 앱입니다.

## 주요 기능

- **SRS 알고리즘**: Anki와 유사한 간격 반복 시스템으로 효율적인 암기
- **HSK 3-6급**: 각 레벨당 100개 이상의 핵심 단어 수록
- **발음 지원**: Web Speech API를 활용한 중국어 발음 재생
- **PWA 지원**: 홈 화면에 추가하여 앱처럼 사용 가능
- **다크 모드**: 눈에 편안한 다크 모드 지원
- **데이터 백업**: JSON 형식으로 학습 데이터 내보내기/가져오기

## 시작하기

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run start
```

## 기술 스택

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Zustand + localStorage
- Web Speech API
- PWA (manifest + Service Worker)
