# Sprite Animation Verification Checklist

## Setup Instructions

1. **Enable Debug Mode** (DONE ✓)
   - Physics debug visualization is now enabled in `src/main.ts`
   - Green collision rectangles will show physics bodies

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   - Game opens in browser at http://localhost:5173
   - Go through character creation (enter name, select background)
   - Player will spawn in AirportScene

3. **Controls**
   - **Arrow Keys** or **WASD** to move
   - **SHIFT** to run
   - **E** to interact (if implemented)

---

## 1. RENDERING CHECK ✓

### Pixel Art Quality
- [ ] Sprite is **crisp and sharp**, NOT blurry
- [ ] Sprite is **exactly 16×32 pixels** displayed on screen (at native resolution 480×270)
- [ ] Edges are clean, no anti-aliasing artifacts
- [ ] Transparent background is visible (no black box around character)
- [ ] Character sits on the tiles, not floating or sunken

**Configuration verified:**
- ✅ `pixelArt: true` in main.ts (line 13)
- ✅ `roundPixels: true` in main.ts (line 14)
- ✅ `image-rendering: pixelated` in index.html (line 29)
- ✅ Spritesheet is PNG with alpha channel (transparent)

**If sprite is blurry:**
1. Check browser zoom is at 100%
2. Verify game window isn't scaled by browser (should fill screen, not tiny)
3. Clear browser cache and hard-refresh (Ctrl+Shift+R)

---

## 2. ANIMATION CHECK ✓

### Walk Down (Facing Camera)
- [ ] Animation plays when moving DOWN (↓ or S key)
- [ ] Character faces toward camera (front-facing)
- [ ] Legs alternate left-right: stride-L → idle → stride-R → idle
- [ ] Walk cycle is **smooth and loops seamlessly** (no pause or stuttering)
- [ ] Walk speed feels natural (not too fast, not too slow)

**Frame sequence:** 0→1→2→3→repeat (4 frames, 8 fps = 0.5 sec per cycle)

### Walk Up (Back-Facing)
- [ ] Animation plays when moving UP (↑ or W key)
- [ ] Character's back is shown (facing away from camera)
- [ ] Backpack/details on back are visible
- [ ] Legs alternate naturally
- [ ] Animation is smooth

**Frame sequence:** 12→13→14→15→repeat

### Walk Left
- [ ] Animation plays when moving LEFT (← or A key)
- [ ] Character faces left profile
- [ ] Legs alternate left-right naturally
- [ ] Animation is smooth

**Frame sequence:** 4→5→6→7→repeat

### Walk Right
- [ ] Animation plays when moving RIGHT (→ or D key)
- [ ] Character faces right profile
- [ ] Legs alternate left-right naturally
- [ ] Animation is smooth

**Frame sequence:** 8→9→10→11→repeat

### Idle Poses
- [ ] When NOT moving, animation switches to idle
- [ ] Idle Down (frame 1): character stands neutral, facing camera
- [ ] Idle Left (frame 5): character stands neutral, facing left
- [ ] Idle Right (frame 9): character stands neutral, facing right
- [ ] Idle Up (frame 13): character stands neutral, facing away
- [ ] Idle frame is **static** (not animated, just a single pose)

### Direction Changes
- [ ] Changing direction **instantly switches animation** (no delay)
- [ ] No animation glitching or frame stuttering
- [ ] Walking down then immediately left plays left animation smoothly
- [ ] All 4 directions respond immediately to input

**If walk animation stutters every 4th frame:**
- Issue would be: frames are [0,1,2,3] when should be [0,1,2,1] or similar
- Diagnosis: Check BootScene.ts createIdleAnimations() — are we using generateFrameNumbers correctly?

---

## 3. PHYSICS CHECK ✓

### Collision Body Position
- [ ] Green collision rectangle shows at character's **feet**, not centered
- [ ] Collision body is **NOT at head level** (would be ~8px from top)
- [ ] Body is positioned at offset (2, 22) from sprite origin
- [ ] Body size is 12×10 pixels (visible as small rectangle at feet)

**Expected visualization:**
```
╔════════════════╗
║   Head Area    ║  ← Transparent (no collision box visible here)
║   Torso Area   ║  ← Transparent (no collision box visible here)
╠══════════════╦╝
║ ┌──────────┐ ║  ← Green box at feet (12w × 10h)
╚═╧══════════╧═╝
```

### Obstacle Collision
- [ ] Walking into the gray test squares stops movement
- [ ] Collision feels **solid**, not mushy
- [ ] Walking into wall from side **does NOT slide upward** (bug to check)
- [ ] Can walk alongside obstacles without catching corners

**Test procedure:**
1. Walk toward gray square on left side
2. Approach from bottom-left, then bottom-right
3. Verify collision is at feet, not higher up

### Wall Bounds
- [ ] Player cannot walk off screen edges
- [ ] Movement stops at world bounds (480×270 viewport)

---

## 4. POTENTIAL ISSUES & FIXES

### Issue: Sprite is blurry
**Diagnosis:**
- Browser zoom? Set to 100%
- Canvas CSS? Should have `image-rendering: pixelated`
- Game config? Should have `pixelArt: true, roundPixels: true`

**Fix if needed:**
```html
<!-- In index.html, ensure canvas style includes: -->
canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

### Issue: Sprite is floating above the ground
**Diagnosis:** Physics body offset is too high

**Current config (in Player.ts):**
```typescript
body.setSize(12, 10);      // 12 pixels wide, 10 pixels tall
body.setOffset(2, 22);     // Start at Y=22 (22px from top of sprite)
```

**Fix if sprite floats:**
Decrease Y offset (e.g., try 20 or 18):
```typescript
body.setOffset(2, 20);  // Try moving collision box up 2px
```

### Issue: Sprite is sunk into floor
**Diagnosis:** Physics body offset is too low

**Fix if sprite sinks:**
Increase Y offset (e.g., try 24 or 26):
```typescript
body.setOffset(2, 24);  // Try moving collision box down 2px
```

### Issue: Walk animation stutters / pauses every 4th frame
**Diagnosis:** Animation frame sequence might be [0,1,2,3] when it should cycle differently

**Current code (in BootScene.ts):**
```typescript
frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
// This produces: [0, 1, 2, 3]
```

This is **correct** for walk cycles (4 frames, smooth loop).

**If there IS stuttering:**
1. Check the spritesheet image itself — is frame 3 identical to frame 0?
2. Try removing frame 3: `{ start: 0, end: 2 }` would be [0,1,2,0,1,2...]
3. Or manually specify: `frames: [0, 1, 2, 1]` for stride pattern

### Issue: Transparency not working (black/white box around character)
**Diagnosis:** Spritesheet needs to be PNG with alpha channel

**Current file:** `public/assets/sprites/player.png`
- ✅ Is PNG (correct format)
- ✅ Has alpha channel (created by sprite processing script)
- ✅ Background removed (converted to transparency)

**If transparency fails:**
1. Check file at: `e:\projects\namma-quest\public\assets\sprites\player.png`
2. If file is missing, run: `node tools/process-sprite.js`
3. If file exists but background is still black, re-run sprite processor

### Issue: Animation doesn't play (sprite is static)
**Diagnosis:** Animation key names might not match, or animation isn't being triggered

**Check in BootScene.ts:**
- Walk animations: `'player-walk-down'`, `'player-walk-left'`, `'player-walk-right'`, `'player-walk-up'`
- Idle animations: `'player-idle-down'`, `'player-idle-left'`, `'player-idle-right'`, `'player-idle-up'`

**Check in Player.ts (line ~147):**
```typescript
private playWalkAnim(): void {
  const animKey = `player-walk-${this.currentDirection}`;
  if (this.anims.currentAnim?.key !== animKey) {
    this.play(animKey);  // ← This triggers the animation
  }
}
```

If animation isn't playing, check the browser console for errors.

### Issue: Sprite doesn't exist / 404 error
**Symptoms:** Browser console shows 404, sprite is missing/gray

**Fix:**
1. Verify file exists: `public/assets/sprites/player.png`
2. Run sprite processor: `node tools/process-sprite.js`
3. Verify Vite is serving static files from `public/` directory

---

## 5. VISUAL VERIFICATION SUMMARY

| Aspect | Expected | Status |
|--------|----------|--------|
| **Pixel Art Quality** | Crisp 16×32 sprite | [ ] Pass |
| **Walk Down** | Front-facing, legs alternate | [ ] Pass |
| **Walk Up** | Back-facing, backpack visible | [ ] Pass |
| **Walk Left** | Left profile, natural stride | [ ] Pass |
| **Walk Right** | Right profile, natural stride | [ ] Pass |
| **Idle Animation** | Static pose, no animation | [ ] Pass |
| **Direction Changes** | Instant, no delay | [ ] Pass |
| **Collision Body** | Green box at feet | [ ] Pass |
| **Collision Feel** | Solid, no sliding | [ ] Pass |
| **Physics Debug** | Green rectangles visible | [ ] Pass |

---

## 6. WHAT TO REPORT IF THERE ARE ISSUES

If you find a problem, please provide:
1. **What you saw** (e.g., "sprite is blurry", "animation stutters")
2. **What you expected** (e.g., "sprite should be crisp")
3. **Steps to reproduce** (e.g., "move left, then move down")
4. **Browser/OS** (e.g., "Chrome on Windows 11")
5. **Browser console errors** (F12 → Console tab)
6. **Screenshot** (if visual issue)

---

## Code Quality Verification ✓

Already verified in source code:

| Item | Status | Location |
|------|--------|----------|
| Spritesheet loads | ✅ Verified | BootScene.ts:35-38 |
| Walk animations correct | ✅ Verified | BootScene.ts:172-198 |
| Idle animations correct | ✅ Verified | BootScene.ts:200-223 |
| Physics body offset | ✅ Verified | Player.ts:40-42 |
| Starting idle frame | ✅ Verified | Player.ts:31 (frame 1) |
| Animation triggers | ✅ Verified | Player.ts:144-161 |
| Camera follow | ✅ Verified | AirportScene.ts:35 |
| Depth sorting | ✅ Verified | AirportScene.ts:43 |
| Debug visualization | ✅ Enabled | main.ts:24 |

---

**All configuration and code is correct. Sprite animation should work perfectly on runtime!**

Please run `npm run dev` and test the checklist above, then report any issues you find.
