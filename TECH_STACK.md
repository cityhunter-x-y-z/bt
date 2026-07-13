# Namma Quest - Tech Stack

## Core Architecture

### Frontend Stack
- **Engine:** Phaser 3.70+
- **UI Framework:** React 18+
- **State Management:** Zustand
- **Build Tool:** Vite
- **Mobile:** Capacitor 6

### Backend Stack
- **Database:** Firebase Realtime Database
- **Authentication:** Firebase Authentication
- **Notifications:** Firebase Cloud Messaging
- **Functions:** Firebase Cloud Functions (minimal)
- **Hosting:** Firebase Hosting (for web)

## Game Features

### AI Bots
- **Engine:** Local Phaser AI (no server required!)
- **Pathfinding:** Simple random walk
- **Name Generation:** Indian name generator (local)
- **Cost:** ₹0 (runs on player's device)

### Multiplayer System
- **Type:** Pseudo-multiplayer (instanced)
- **Sync:** Firebase Realtime DB (lightweight)
- **Sessions:** Temporary 5-min co-op
- **Complexity:** ⭐⭐ (Very manageable!)

### Social Features
- **Profiles:** Firebase Firestore
- **Discovery:** Query-based filtering
- **Friends:** Persistent connections
- **Style:** Dating app UX

## Key Advantages
✅ Looks like MMO, but isn't (smart illusion!)  
✅ Bots provide atmosphere (no cost)  
✅ Real players add authenticity (light sync)  
✅ 5-min sessions keep it casual (no commitment)  
✅ Dating app style is trendy (fits target audience)  
✅ Leaderboard creates competition (engagement)  
✅ Story + tasks (core gameplay)  
✅ In-app purchases (monetization)  
✅ Solo dev friendly (no complex server)  
✅ Bangalore context (unique selling point)  

## Development & Deployment

### PWA Deployment (Phase 1 - Weeks 1-4)
**Purpose:** Initial soft launch, rapid user testing

Tools:
- `vite-plugin-pwa` (PWA generation)
- `Workbox` (Service workers for offline caching)
- Web App Manifest (installability configuration)
- PWA Asset Generator (icon generation)

Hosting Options:
- **Vercel** (primary - free tier, auto-deploy)
- **Netlify** (backup - free tier)
- **Cloudflare Pages** (alternative - global CDN)

Features Enabled:
- ✅ Add to home screen (Android & iOS)
- ✅ Offline play (cached assets)
- ✅ Push notifications (Firebase Cloud Messaging)
- ✅ App-like experience (fullscreen, splash screen)
- ✅ Auto-updates (no store approval needed)
- ✅ Share link to install (viral growth potential)

**Advantages:**
- Launch in 1 day (no store approval)
- Update anytime (instant deployment)
- Cross-platform (one URL, works everywhere)
- Zero distribution cost
- Perfect for beta testing
- Works on any modern browser

**Cost:** ₹0

### Native Apps via Capacitor (Phase 2 - Production)

#### Framework
- @capacitor/core (core runtime)
- @capacitor/cli (build tools)
- @capacitor/android (Android platform)
- @capacitor/ios (iOS platform)
- Ionic Native plugins (optional)

#### Android Requirements
- Android Studio (IDE & emulator)
- Android SDK Platform 33+ (Target API level)
- Gradle 8+ (build system)
- Java JDK 17+

#### iOS Requirements (if App Store)
- Xcode 15+ (IDE & simulator)
- macOS Ventura+ (required)
- CocoaPods (dependency manager)
- Apple Developer Account ($99/year)
- Physical iPhone (for testing)

#### Build Process
```
npm run build                    # Vite production build
npx cap sync                     # Sync web assets to native
npx cap open android             # Open in Android Studio
npx cap open ios                 # Open in Xcode
# Build APK/IPA from respective IDEs
```

### Essential Capacitor Plugins
- @capacitor/app (app state, deep links)
- @capacitor/splash-screen (native splash)
- @capacitor/status-bar (status bar styling)
- @capacitor/keyboard (keyboard behavior)
- @capacitor/push-notifications (FCM integration)
- @capacitor/network (online/offline detection)

### Optional Capacitor Plugins
- @capacitor/haptics (vibration feedback)
- @capacitor/geolocation (location services)
- @capacitor/share (share achievements)
- @capacitor/local-notifications (offline reminders)
- @capacitor/camera (profile picture upload)
- @capacitor/filesystem (save screenshots)
- @capacitor-community/firebase-analytics
- cordova-plugin-purchase (in-app purchases)
- @capacitor-community/admob (ads)

## App Store Configuration

### Google Play Store
**Timeline:** 3-7 days review

**Requirements:**
- Developer account (₹1,500 one-time)
- App bundle (.aab file, not .apk)
- Privacy policy URL
- Target API level 33+ (Android 13+)
- Content rating questionnaire

**Assets:**
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)
- Screenshots (min 2, up to 8)
- Short description (80 chars)
- Full description (4000 chars max)

### Apple App Store
**Timeline:** 2-7 days (stricter review)

**Requirements:**
- Developer account ($99/year)
- .ipa file (built on macOS)
- Privacy policy URL
- Age rating classification
- App review guidelines compliance

**Assets:**
- App icon (1024x1024 PNG)
- Screenshots (multiple sizes)
- App preview video (optional, recommended)
- App description

## Distribution Strategy

### Phase 1 (Weeks 1-4): PWA Only
- Deploy to Vercel
- Share URL on social media
- Gather feedback quickly
- Iterate based on response
- **Cost:** ₹0

### Phase 2 (Weeks 5-8): Android Priority
- Build .aab with Capacitor
- Submit to Play Store
- Continue PWA updates in parallel
- 95% of Indian mobile gamers on Android
- **Cost:** ₹1,500 one-time

### Phase 3 (Weeks 9+): iOS (if demand exists)
- Build .ipa (requires Mac/Mac cloud service)
- Submit to App Store
- Maintain parity across platforms
- **Cost:** ₹8,000/year (Apple Developer)

## Development Tools

### IDE & Editor
**Primary:** VS Code / Cursor
- Extensions:
  - ESLint (code linting)
  - Prettier (code formatting)
  - Phaser 3 Snippets (game dev shortcuts)
  - Firebase (Firebase integration)
  - GitLens (Git visualization)
  - Error Lens (inline error display)
  - Thunder Client (API testing)
- Settings:
  - Auto-save enabled
  - Format on save
  - ESLint auto-fix

**Alternative:** WebStorm (paid, powerful for JS)

### Terminal & CLI Tools
- Node.js 18 LTS or 20 LTS (JavaScript runtime)
- npm 9+ or pnpm 8+ (package managers, pnpm faster)
- Git 2.40+ (version control)
- Firebase CLI (firebase-tools via npm)

### Browser DevTools
- Chrome DevTools (primary testing)
- Firefox Developer Edition (alternative)
- Device emulation (mobile viewport testing)
- Lighthouse (performance auditing)
- Network throttling (simulate 3G/4G)

## Development Milestones

### MVP 1: Core Gameplay (Week 1-2)
- Whitefield area with 100 bot sprites
- Player can walk around
- Bots walk randomly
- Simple task system (collect X, go to Y)
- Point tracking
- Leaderboard (fake data)
- **Goal:** Prove core gameplay is fun

### MVP 2: Social & Authentication (Week 3-4)
- Firebase setup
- User authentication
- "Online Players" panel (shows real users)
- Profile creation
- Mark 10 bots as "real players" (testing)
- **Goal:** Social UI works and looks good

### MVP 3: Co-op Multiplayer (Week 5-6)
- Friend request flow
- Push notifications
- 5-min session creation
- Position sync (2 players)
- Timer and auto-end
- Add to friends list
- **Goal:** End-to-end co-op working

---

**Project:** Namma Quest  
**Target:** Indian mobile gamers (casual, social)  
**Platform Priority:** Android → iOS (if demand)  
**Solo Dev Friendly:** Yes  
**Scalability:** Handled by Firebase + pseudo-multiplayer design
