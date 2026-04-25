# HSK Master 📚

SRS(간격 반복) 방식으로 HSK 3–6급 중국어 단어를 효율적으로 암기하는 PWA 앱입니다.

---

## 1. 이 앱은 무엇인가요?

**HSK Master**는 중국어 HSK 시험을 준비하는 분들을 위한 **무료 단어 암기 웹앱**입니다. 과학적으로 증명된 **SRS(간격 반복 시스템)** 방법을 사용해서, 짧은 시간 안에 많은 단어를 효과적으로 외울 수 있도록 도와줍니다. HSK 3–6급 단어가 모두 포함되어 있고, 중국어 발음도 자동으로 들려줍니다. 스마트폰 홈 화면에 앱처럼 설치해서 언제 어디서나 사용할 수 있어요.

**주요 기능:**
- 📚 HSK 3, 4, 5, 6급 단어 (각 레벨 100개 이상 수록)
- 🧠 4단계 평가 (다시/어려움/좋음/쉬움) SRS 알고리즘
- 🔊 중국어 발음 자동 재생
- 📊 학습 통계 및 진행도 확인
- 🌙 다크 모드 지원
- 📲 PWA — 홈 화면에 앱처럼 설치 가능
- 💾 학습 데이터 자동 저장 (인터넷 없이도 작동)

---

## 2. Vercel에 무료로 배포하기

> Vercel은 무료로 웹사이트를 인터넷에 올릴 수 있는 서비스입니다. 아래 단계를 따라하면 5분 안에 완료할 수 있어요!

### 단계 1: GitHub에 로그인

1. [github.com](https://github.com) 에 접속합니다
2. 오른쪽 위 **Sign in** 버튼을 클릭해서 로그인합니다
   - 계정이 없으면 **Sign up** 으로 먼저 가입하세요 (무료)

### 단계 2: Vercel 계정 만들기

1. [vercel.com](https://vercel.com) 에 접속합니다
2. **"Start Deploying"** 또는 **"Sign Up"** 버튼 클릭
3. **"Continue with GitHub"** 선택 → GitHub 계정으로 로그인

### 단계 3: 새 프로젝트 만들기

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. **"Import Git Repository"** 섹션에서 `hsk-master` 저장소를 찾아 **"Import"** 클릭
   - 목록에 없으면 **"Adjust GitHub App Permissions"** 클릭 후 저장소 접근 허용

### 단계 4: 배포 시작

1. 프로젝트 설정 화면에서 아무것도 바꾸지 않고 바로 **"Deploy"** 버튼 클릭
2. 1–2분 기다리면 배포 완료! 🎉
3. 완료되면 `https://hsk-master-xxxx.vercel.app` 형식의 URL이 생깁니다

### 단계 5: 스마트폰에서 열기

1. 스마트폰에서 위의 URL을 엽니다
2. 앱처럼 설치하는 방법은 아래 **3번** 항목을 참고하세요

---

## 3. 스마트폰 홈 화면에 설치하기

### 아이폰 (iOS Safari)

1. Safari에서 앱 URL을 엽니다
2. 하단의 **공유 버튼** (네모에 화살표 아이콘) 탭
3. **"홈 화면에 추가"** 선택
4. 이름 확인 후 **"추가"** 탭
5. 홈 화면에 HSK Master 아이콘이 생깁니다! 📱

### 안드로이드 (Chrome)

1. Chrome에서 앱 URL을 엽니다
2. 오른쪽 위 **점 세 개 메뉴(⋮)** 탭
3. **"앱 설치"** 또는 **"홈 화면에 추가"** 선택
4. **"설치"** 탭
5. 홈 화면에 HSK Master 아이콘이 생깁니다! 📱

---

## 4. 앱 사용 방법

### 기본 사용법

1. **앱 열기** — 홈 화면의 HSK Master 아이콘을 탭합니다
2. **학습 시작** — 홈 화면에서 **"📚 학습 시작"** 버튼을 탭합니다
3. **카드 보기** — 화면에 한자가 표시됩니다. 🔊 버튼으로 발음을 들을 수 있어요
4. **카드 뒤집기** — 카드를 탭하면 병음(발음), 한국어 뜻, 예문이 나타납니다
5. **평가하기** — 4개의 버튼 중 하나를 선택합니다:
   - 🔴 **다시** — 완전히 모르겠어요, 바로 다시 볼게요
   - 🟠 **어려움** — 기억나긴 하지만 어려워요
   - 🟢 **좋음** — 잘 기억하고 있어요
   - 🔵 **쉬움** — 완벽하게 알고 있어요

### 메뉴 설명

| 메뉴 | 설명 |
|------|------|
| 🏠 홈 | 오늘의 학습 현황과 레벨별 진행도 |
| 📚 학습 | 플래시카드 학습 화면 |
| 📊 통계 | 전체 학습 통계, 연속 학습일 |
| ⚙️ 설정 | 하루 학습량, 레벨 선택, 데이터 백업 |

### 설정 팁

- **설정 → 신규 단어 (하루)**: 처음에는 20–30개가 적당합니다
- **설정 → 학습 레벨**: 원하는 HSK 레벨을 선택하세요 (여러 개 선택 가능)
- **설정 → 데이터 내보내기**: 정기적으로 백업해 두세요!

---

## 5. 단어 추가하기

단어를 추가하려면 `data/` 폴더 안의 JSON 파일을 수정합니다.

### 예시: HSK 3급에 단어 추가 (`data/hsk3.json`)

파일을 열면 이런 형식으로 되어 있습니다:

```json
[
  {
    "id": "hsk3-001",
    "hanzi": "爱好",
    "pinyin": "àihào",
    "meaning_ko": "취미, 좋아하는 것",
    "example_zh": "你有什么爱好？",
    "example_ko": "취미가 뭐예요?",
    "level": 3
  }
  // 여기에 새 단어를 추가하면 됩니다 ↓
]
```

배열 끝에 쉼표(,)를 추가하고 새 단어를 이렇게 추가합니다:

```json
  {
    "id": "hsk3-200",
    "hanzi": "漂亮",
    "pinyin": "piàoliang",
    "meaning_ko": "예쁘다, 아름답다",
    "example_zh": "她很漂亮。",
    "example_ko": "그녀는 매우 예쁩니다.",
    "level": 3
  }
```

**주의사항:**
- `id`는 다른 단어와 겹치지 않게 고유하게 설정하세요
- `level`은 파일에 맞는 숫자(3, 4, 5, 6)를 입력하세요
- GitHub에서 직접 파일을 수정하면 Vercel이 자동으로 재배포합니다

---

## 6. 데이터 백업 및 복원

### 백업 (다른 기기로 이전할 때)
1. **설정** → **"📤 데이터 내보내기 (백업)"** 탭
2. JSON 파일이 다운로드됩니다 (예: `hsk-master-backup-2025-01-01.json`)
3. 이 파일을 안전한 곳에 보관하세요

### 복원
1. **설정** → **"📥 데이터 가져오기 (복원)"** 탭
2. 저장해 둔 JSON 파일을 선택합니다
3. "✅ 가져오기 성공!" 메시지가 나오면 완료

---

## English Overview

**HSK Master** is a Progressive Web App (PWA) for memorizing HSK 3–6 Chinese vocabulary using the Spaced Repetition System (SRS / modified SM-2 algorithm). Built for Korean learners preparing for the HSK exam.

**Tech stack:** Next.js 14+ (App Router) · TypeScript · Tailwind CSS · Zustand + localStorage · Web Speech API · PWA

**Features:** SRS flashcards with 4-rating system · Auto-pronunciation · Statistics · Dark mode · Offline support · Export/import progress

**One-click deploy:** Import this repo on [vercel.com](https://vercel.com) and click Deploy. No configuration needed.

**Project structure:**
```
app/              # Next.js App Router pages
components/       # React components (Flashcard, RatingButtons, NavBar, ProgressBar)
lib/              # SRS algorithm, Zustand store, TTS wrapper, TypeScript types
data/             # HSK 3–6 vocabulary JSON files (add more words by appending to the array)
public/           # PWA manifest, service worker, icons
```

---

## 라이선스 / License

MIT — 개인 학습 목적으로 자유롭게 사용하세요.
