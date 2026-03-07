# 🎧 EQUALIZER

An AI-powered, mobile-first IEM equalizer app that analyzes your music and generates personalized 15-band EQ settings based on your IEM model and listening preferences.

#####VIBE CODED

## Features

- 🎵 **Song Analysis** — Detects genre, energy, mood, BPM, bass emphasis, and more
- 🎧 **IEM Profile Matching** — Fuzzy-matched against a curated database of 28+ popular IEM models
- 📊 **15-Band EQ Generation** — Deterministic rules engine combining song + IEM + preference
- 🌈 **Dynamic UI Vibe** — Adapts visually between Energetic 🔥 and Peaceful 🌙 modes
- 💾 **Preset Storage** — Save and reload EQ settings with localStorage persistence
- 📱 **Mobile-First** — Optimized for Android/iOS via Capacitor

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

## Building an Android APK

### 1. Install Capacitor CLI (if not already)

```bash
npm install -g @capacitor/cli
```

### 2. Build the web app

```bash
npm run build
```

### 3. Add Android platform

```bash
npm run cap:add:android
```

### 4. Sync web assets to native project

```bash
npm run cap:sync
```

### 5. Open in Android Studio

```bash
npm run cap:open:android
```

Then in Android Studio: **Build → Generate Signed Bundle/APK**

## Project Structure

```
src/
├── types/           # TypeScript interfaces and types
│   └── index.ts
├── data/
│   └── iemDatabase.ts   # IEM profiles + fuzzy matching engine
├── engine/
│   ├── songAnalysis.ts  # Genre/energy/mood heuristics
│   └── eqEngine.ts      # 15-band EQ recommendation logic
├── utils/
│   └── storage.ts       # Preset localStorage persistence
├── components/
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── PreferenceSelector.tsx
│   ├── EQChart.tsx          # Recharts area chart
│   ├── EQBandGrid.tsx       # Band value grid with mini bars
│   └── PresetList.tsx
├── screens/
│   ├── HomeScreen.tsx       # Song + IEM input + preferences
│   ├── ResultsScreen.tsx    # Full analysis results + EQ
│   └── PresetsScreen.tsx    # Saved presets list
├── App.tsx
├── main.tsx
└── index.css
```

## EQ Band Frequencies

| Band | Freq  | Range       |
|------|-------|-------------|
| 1    | 25 Hz | Sub-bass    |
| 2    | 40 Hz | Sub-bass    |
| 3    | 63 Hz | Bass        |
| 4    | 100 Hz| Bass        |
| 5    | 160 Hz| Bass        |
| 6    | 250 Hz| Low-mid     |
| 7    | 400 Hz| Low-mid     |
| 8    | 630 Hz| Mid         |
| 9    | 1 kHz | Mid         |
| 10   | 1.6 kHz| Upper-mid  |
| 11   | 2.5 kHz| Upper-mid  |
| 12   | 4 kHz | Presence    |
| 13   | 6.3 kHz| Presence   |
| 14   | 10 kHz| Air         |
| 15   | 16 kHz| Air         |

Gains are bounded to **±6 dB**. Preamp is auto-computed to prevent clipping.

## Supported IEM Models

Includes profiles for:
- **Moondrop**: Aria, Starfield, Blessing 2, KATO
- **KZ**: ZSN Pro, ZEX Pro, ZS10 Pro
- **Tin HiFi**: T2, T3
- **Etymotic**: ER2XR, ER4XR
- **Sony**: IER-M7, IER-Z1R
- **Shure**: SE215, SE535
- **Campfire Audio**: Andromeda, Solaris
- **64 Audio**: U12T
- **Sennheiser**: IE300, IE600
- **Final**: A4000, E3000
- **BLON**: BL-03
- **Truthear**: Hola, ZERO
- **Simgot**: EM6L
- **Letshuoer**: S12
- **Thieaudio**: Oracle

Unrecognized models fall back to a generic neutral profile with low confidence indicator.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18   | UI framework |
| Vite 5     | Build tool + dev server |
| TypeScript 5| Type safety |
| Tailwind CSS 3| Styling |
| Recharts   | EQ visualization chart |
| Capacitor 6| Android/iOS packaging |

## License

MIT
