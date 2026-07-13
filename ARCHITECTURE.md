# Namma Quest - Architecture & Infrastructure

## Tech Stack at a Glance

### Core Engine
- **Game Engine:** Phaser 3
- **Frontend Framework:** React 18
- **State Management:** Zustand
- **Build Tool:** Vite
- **Mobile Wrapper:** Capacitor 6

### Backend Infrastructure
- **Database:** Firebase Realtime Database
- **Authentication:** Firebase Authentication
- **Notifications:** Firebase Cloud Messaging (FCM)
- **Serverless:** Firebase Cloud Functions

### Hosting & Distribution
- **Web (PWA):** Vercel (primary) + Firebase Hosting (backup)
- **Mobile:** Play Store → App Store (via Capacitor)

---

## Asset Creation Pipeline

| Asset Type | Tool |
|-----------|------|
| Sprites | Aseprite |
| Maps | Tiled |
| Audio | Bosca Ceoil + Bfxr |
| UI/UX Design | Figma |
| Optimization | Squoosh, TinyPNG |

---

## Development Environment

**IDE & Tools:**
- VS Code + Extensions
- Git + GitHub
- Chrome DevTools

**Native Building:**
- Android Studio (APK/AAB builds)

---

## Testing Strategy

**Primary:** Physical devices (real-world testing)

**Secondary:**
- Android Emulator (local testing)
- Chrome Device Emulation (responsive design)

---

## Analytics & Monitoring

- **User Analytics:** Firebase Analytics
- **Error Tracking:** Sentry
- **Performance Audit:** Lighthouse

---

## Deployment Pipeline

```
Code → GitHub → Vercel (auto-deploy PWA)
                ↓
         Firebase Hosting (backup)
                ↓
        Capacitor Build → Play Store
                ↓
        Optional → App Store
```

---

## Cost Breakdown

### Development
- **One-time:** ₹1,500 (Aseprite license)
- **Free:** VS Code, Vite, Firebase free tier, Vercel

### Monthly Operations
- **Scales with users:** ₹0-5,000 (Firebase usage)
- **Free:** Vercel free tier, Sentry free tier

### Distribution
- **Android Play Store:** ₹1,500 (one-time developer account)
- **iOS App Store:** ₹8,000/year (Apple Developer + Capacitor/Mac build)
- **Total distribution:** ₹1,500-10,000

**Net:** Solo dev friendly with minimal upfront costs

---

## Deployment Flow

1. **Local Development** → Push to GitHub
2. **Vercel** → Auto-build & deploy PWA (instant)
3. **Firebase Hosting** → Backup/fallback hosting
4. **Capacitor** → Generate APK/AAB for Play Store
5. **App Store** → Optional iOS release

---

## Key Infrastructure Decisions

✅ **Serverless-first:** Firebase reduces backend complexity  
✅ **Instant deployment:** Vercel auto-deploy on git push  
✅ **Zero server maintenance:** No ops overhead  
✅ **Cross-platform:** One codebase → Web, Android, iOS  
✅ **Performance:** Vite + Phaser 3 for fast load times  
✅ **Scalability:** Firebase auto-scales with usage  
✅ **Cost-effective:** Free tier sufficient for launch  

---

## Next Steps

1. Initialize Vite + React project
2. Setup Firebase project & authentication
3. Integrate Phaser 3 with React
4. Setup Vercel deployment
5. Build MVP gameplay loop
6. Test on physical devices
7. Prepare Play Store submission

---

**Updated:** 2026-07-13  
**Status:** Architecture defined, ready for implementation  
**Solo Dev:** Yes - no external team dependencies
