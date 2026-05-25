# 🛡️ Make Me Survive — Survival Encyclopedia

A complete offline survival encyclopedia with AI assistant.  
Works as a **web app** in any browser and as an **Android APK** — no internet required for the encyclopedia itself.

[![Build Android APK](https://github.com/YOUR_USERNAME/make-me-survive/actions/workflows/build-apk.yml/badge.svg)](https://github.com/YOUR_USERNAME/make-me-survive/actions/workflows/build-apk.yml)

---

## 📱 Download

Go to [Releases](https://github.com/YOUR_USERNAME/make-me-survive/releases) and download the latest `app-release.apk`.

**Install on Android:**
1. On your phone: Settings → Security → Enable "Install from unknown sources"
2. Transfer the APK (USB, email, or download directly from GitHub on your phone)
3. Tap the APK file → Install

---

## 🌐 Use as a web app (no install needed)

Open `src/index.html` in any browser. That's it. Works fully offline.

Or serve locally:
```bash
npx serve src -p 3000
```
Then open http://localhost:3000

---

## 🔧 Build the Android APK yourself

### Prerequisites
- [Node.js 20+](https://nodejs.org)
- [Android Studio](https://developer.android.com/studio) with Android SDK 34
- Java 17 (comes with Android Studio)

### First-time setup
```bash
git clone https://github.com/YOUR_USERNAME/make-me-survive.git
cd make-me-survive
npm install
npx cap sync android
npx cap open android
```

Android Studio opens. Wait for Gradle sync, then:
- **Debug APK:** Build → Build Bundle(s)/APK(s) → Build APK(s)
- **Release APK:** Build → Generate Signed Bundle/APK → APK

Or from the command line:
```bash
# Debug
npm run build:android:debug
# APK is at: android/app/build/outputs/apk/debug/app-debug.apk

# Release (unsigned)
npm run build:android:release
# APK is at: android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### First-time Android setup (only needed once)
If you cloned fresh and the `android/` folder doesn't exist:
```bash
npm install
npm run cap:init      # initialises Capacitor
npm run cap:add:android   # creates the android/ project
npm run sync          # copies web assets into android/
```

---

## 🤖 AI Configuration

### Option 1: Anthropic Claude (default — requires internet)
The app ships pre-configured to use the Anthropic API.  
Get your API key at [console.anthropic.com](https://console.anthropic.com).

Edit `src/index.html` and find the `sendAI()` function. The API key is handled by the browser — you can add it as a header or use a proxy.

### Option 2: Ollama (local server — works on home WiFi)
1. Install Ollama: https://ollama.ai
2. Pull a model: `ollama pull llama3.1:8b`
3. Start with LAN access: `OLLAMA_HOST=0.0.0.0 ollama serve`
4. In `src/index.html`, find `sendAI()` and change the endpoint:
```javascript
// Replace this:
const response = await fetch('https://api.anthropic.com/v1/messages', { ... })

// With this (replace IP with your server's local IP):
const response = await fetch('http://192.168.1.100:11434/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama3.1:8b',
    messages: aiHistory,
    stream: false
  })
});
const data = await response.json();
const reply = data.message.content;
```

### Option 3: Fully offline on-device AI (Android)
Uses [MLC LLM](https://mlc.ai) — the model runs directly on the phone.
- Model download: ~2.5–4 GB (one time)
- Requires: 6+ GB RAM on the phone
- Models available: Phi-3-mini, Llama-3.2-3B, Gemma-2-2B
- Integration guide: https://mlc.ai/docs/deploy/android

---

## 📁 Project structure

```
make-me-survive/
├── src/
│   └── index.html          ← The entire encyclopedia (single file)
├── android-config/         ← Android config templates
│   ├── app-build.gradle    ← Merge into android/app/build.gradle
│   ├── AndroidManifest.xml ← Merge into android manifest
│   └── strings.xml         ← App name and package strings
├── .github/
│   └── workflows/
│       └── build-apk.yml   ← Automated APK build on every push
├── docs/
│   └── SETUP.md            ← Detailed setup guide
├── capacitor.config.json   ← Capacitor/APK configuration
├── package.json            ← Node dependencies and scripts
└── README.md
```

---

## 🔄 Automated APK builds (GitHub Actions)

Every push to `main` automatically builds a debug APK, downloadable from the Actions tab.

To publish a release with a signed APK:
1. Create a keystore: `keytool -genkey -v -keystore release.keystore -alias makemesurvive -keyalg RSA -keysize 2048 -validity 10000`
2. Add these GitHub Secrets (Settings → Secrets → Actions):
   - `KEYSTORE_BASE64` — base64-encoded keystore: `base64 -i release.keystore`
   - `KEY_ALIAS` — your alias (e.g. `makemesurvive`)
   - `KEYSTORE_PASSWORD` — your keystore password
   - `KEY_PASSWORD` — your key password
3. Push a version tag: `git tag v1.0.0 && git push --tags`
4. GitHub Actions builds, signs, and publishes a GitHub Release automatically.

---

## 📖 Encyclopedia contents

57 articles across 20 categories:
- 💧 Water & Sanitation · 🔥 Fire & Shelter · 🌿 Food & Foraging
- 🏥 First Aid & Medical · ⚡ Power & Energy · 🔧 Repairs & Mechanics
- 🌾 Agriculture & Livestock · 📡 Communication · 🏗️ Construction
- 🗺️ Security & Navigation · 🧪 Chemistry · 🥫 Food Preservation
- ⚙️ Tools & Metalworking · 💊 Medical Supplies & Drugs
- 🎯 Morale & Mental Health · 👶 Baby & Child Care
- 🛡️ Safety & Self-Defense · 🌱 Medicinal & Edible Plants
- 🔋 Batteries & Electronics · 🔌 Electrical Diagnostics

12 detailed SVG technical illustrations — all offline, all printable.  
Full EU/metric units throughout.  
AI assistant (online) or local model (offline).

---

## 🖨️ Print as PDF

Click the **"🖨 Print All as PDF"** button in the app. The browser's print dialog opens with a fully formatted A4 layout including cover page, table of contents, category dividers, and all diagrams.

---

## 📄 License

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International**

You are free to:
- **Share** — copy and redistribute in any medium or format
- **Adapt** — remix, transform, and build upon the material

Under the following terms:
- **Attribution** — You must give appropriate credit and link to this repository
- **NonCommercial** — You may **not** use this for commercial purposes or sell it
- **ShareAlike** — If you remix or adapt it, you must distribute under the same license

This means: free forever for personal use, communities, and non-profit organisations.  
Nobody can sell it, paywall it, or close-source a modified version.

© 2026 [Rotirot](https://github.com/Rotirot) — Keep a copy offline. Stay safe.
