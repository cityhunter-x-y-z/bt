# Sprite Animation Testing Guide

## Quick Start

```bash
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## What to Expect

### Character Creation (First Time)
1. **Name Input Screen**
   - Enter any name (e.g., "Alex")
   - Press ENTER

2. **Background Selection**
   - Choose one of 4 education backgrounds
   - Click or press ENTER

3. **Game Starts**
   - Player appears in AirportScene at center of screen
   - A simple tiled grid is visible
   - Two gray obstacle squares are placed for testing

---

## Visual Tests

### Test 1: Walk Animation - Down Direction
**Steps:**
1. Press **DOWN ARROW** or **S** key
2. Hold the key down for ~2 seconds

**What to see:**
- Character faces toward camera (front-facing)
- Legs move in alternating pattern: left leg forward → both legs neutral → right leg forward → both legs neutral
- Animation loops smoothly (0.5 second cycle)
- Motion feels natural, not choppy

**Frame sequence:** Frames 0→1→2→3→repeat (4 frames, 8 fps)

---

### Test 2: Walk Animation - Up Direction
**Steps:**
1. Press **UP ARROW** or **W** key
2. Hold for ~2 seconds

**What to see:**
- Character's back is visible (facing away from camera)
- Should see backpack or details on character's back
- Legs alternate smoothly
- Animation loops without stuttering

**Frame sequence:** Frames 12→13→14→15→repeat

---

### Test 3: Walk Animation - Left Direction
**Steps:**
1. Press **LEFT ARROW** or **A** key
2. Hold for ~2 seconds

**What to see:**
- Character shows left profile (facing left)
- Left leg and right leg visible in motion
- Walk cycle is natural and symmetrical

**Frame sequence:** Frames 4→5→6→7→repeat

---

### Test 4: Walk Animation - Right Direction
**Steps:**
1. Press **RIGHT ARROW** or **D** key
2. Hold for ~2 seconds

**What to see:**
- Character shows right profile (facing right)
- Legs alternate naturally
- Symmetrical to left walk

**Frame sequence:** Frames 8→9→10→11→repeat

---

### Test 5: Idle Pose
**Steps:**
1. Press a direction key and hold (e.g., DOWN)
2. After character is moving, **release all keys**
3. Keep releasing for ~2 seconds

**What to see:**
- Animation immediately stops
- Character displays a **static standing pose**
- No animation playing, just a single frame
- Pose is neutral and balanced

**Expected idle frames:** 1 (down), 5 (left), 9 (right), 13 (up)

---

### Test 6: Direction Changes
**Steps:**
1. Press DOWN (walk down for 1 second)
2. **While walking down**, press LEFT
3. Observe the transition

**What to see:**
- Animation **instantly switches** to left walk
- No frame stutter or delay
- Smooth transition between directions

**Repeat:**
- Down → Up
- Left → Right
- Right → Down
- Each direction should switch immediately

---

### Test 7: Pixel Art Quality
**What to look for:**
- [ ] Sprite is **crisp and sharp**, not blurry
- [ ] Edges are clean with no fuzzy anti-aliasing
- [ ] Character is exactly 2 tiles tall (16px wide × 32px tall)
- [ ] Transparent background visible (no black box around sprite)
- [ ] Colors are vibrant and not washed out

---

### Test 8: Physics Collision
**Steps:**
1. Walk toward the **gray square obstacle on the left side** (below center)
2. Try to walk into it from different angles:
   - From the bottom-left
   - From the bottom-right
   - From directly below

**What to see (with debug visualization):**
- **Green rectangle** at character's feet represents collision body
- Should be positioned at the very bottom of the sprite
- When walking into obstacle, character stops at collision
- Collision feels solid, not squishy

**Expected collision body:**
- Position: offset (2, 22) from sprite origin
- Size: 12×10 pixels
- Should be in the bottom ~10 pixels of the 32px sprite

---

### Test 9: Run Speed (Optional)
**Steps:**
1. Press DOWN to walk
2. While holding DOWN, press **SHIFT** to run
3. Hold both for 2 seconds
4. Release SHIFT

**What to see:**
- With SHIFT: character moves **faster** (130 pixels/sec)
- Without SHIFT: character moves **slower** (80 pixels/sec)
- Animation speed stays the same (8 fps)
- Character still faces correct direction

---

## Physics Debug Visualization

When you run the game, you should see:
- **Green rectangles** at the character's feet (collision body)
- These represent the active physics bodies
- Size: 12×10 pixels
- Position: at the feet, NOT at the head/center

**If you DON'T see green boxes:**
- Debug mode is enabled in main.ts
- Might be rendered off-screen or too small to see
- Try zooming into the player character (browser zoom to 150%)

---

## Common Issues & Quick Fixes

### Issue: Sprite is blurry
**Likely cause:** Browser zoom or CSS issue

**Fix:**
1. Set browser zoom to **100%** (Ctrl+0)
2. Hard refresh page (Ctrl+Shift+R)
3. Check dev tools: do you see `image-rendering: pixelated` in canvas CSS?

### Issue: Animation is missing/static
**Likely cause:** Animation not loaded or sprite image missing

**Fix:**
1. Check browser DevTools Console (F12 → Console)
2. Look for 404 errors or missing image warnings
3. If missing, run: `node tools/process-sprite.js`
4. Refresh page

### Issue: Character floating or sunken
**Likely cause:** Physics body offset incorrect

**Current config:** offset (2, 22), size (12, 10)

**To adjust:**
- Edit `src/entities/Player.ts` line 42
- Change `setOffset(2, 22)` to `setOffset(2, 20)` if floating
- Change `setOffset(2, 22)` to `setOffset(2, 24)` if sunken

### Issue: Animation stutters every 4th frame
**Likely cause:** Frame sequence or spritesheet issue

**Check:**
1. Is spritesheet correctly created? Run: `node tools/process-sprite.js`
2. Verify BootScene.ts uses: `{ start: 0, end: 3 }` (not `end: 2`)
3. Check spritesheet file size matches: 64×128 pixels

---

## Performance Notes

- Sprite should render at **60 fps** (smooth motion)
- Animation plays at **8 fps** (smooth walk cycle)
- Physics checks at **60 fps** (responsive collision)
- No lag or stuttering unless system is overloaded

If you see drops below 60 fps:
- Close other tabs/applications
- Check browser console for JavaScript errors
- Try a different browser

---

## What's Verified in Code ✓

All of the following have been verified and are correct:

| Component | Status | Details |
|-----------|--------|---------|
| Spritesheet loading | ✅ Correct | 64×128, 16×32 frames, PNG with alpha |
| Animation definitions | ✅ Correct | 4 walk + 4 idle, correct frame ranges |
| Physics body | ✅ Correct | 12×10 at offset (2, 22) |
| Starting frame | ✅ Correct | Frame 1 (idle down) |
| Camera follow | ✅ Correct | Smooth damping enabled |
| Depth sorting | ✅ Correct | Dynamic based on Y position |
| Pixel rendering | ✅ Correct | CSS + Phaser config both set |
| Debug visualization | ✅ Enabled | Physics debug: true |

---

## When Testing is Complete

If **all tests pass**, the sprite animation is working correctly and you can:

1. ✅ Remove debug visualization (set `debug: false` in main.ts)
2. ✅ Commit code to repository
3. ✅ Begin implementing game systems (dialogue, quests, etc.)

If **issues found**, note them and report:
- What you observed
- What you expected
- Steps to reproduce
- Screenshot if visual

Then we can debug and fix any problems.

---

## Next Steps After Sprite Verification

Once sprite animation is verified:
1. **Tilemap Integration** — Load Tiled maps for each scene
2. **NPC Implementation** — Add NPCs with idle/walk animations
3. **Dialogue System** — Implement dialogue trees and character interaction
4. **Quest System** — Add quest tracking and objectives
5. **UI/HUD** — Energy, stress, money bars at top of screen

But first, test the sprite and make sure everything looks great!

**Happy testing!** 🎮
