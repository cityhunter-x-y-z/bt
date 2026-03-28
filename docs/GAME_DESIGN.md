# Namma Quest — Game Design Document

> **Living document** — update as design evolves through playtesting and iteration.

---

## 1. Game Identity

**Title**: Namma Quest
**Genre**: Top-Down Action RPG / Life Simulation
**Tone**: Balanced — funny moments with real emotional weight
**Tagline**: *"Every career starts with a really expensive auto ride."*

**Elevator Pitch**: A GBA-style pixel RPG where you play as a small-town graduate who just landed in Bangalore. Navigate autorickshaw negotiations, survive PG food, ace job interviews, and find your place in India's Silicon Valley. Think Earthbound meets the Indian hustle.

---

## 2. Player Character

### Identity
- **Origin**: Small town in another Indian state (total outsider to Bangalore)
- **Age**: 21–23
- **Status**: Fresh graduate, no work experience, limited savings
- **Motivation**: Build a career, prove themselves, achieve independence

### Character Creation
The player chooses:
1. **Name** (text input, max 12 characters)
2. **Educational Background** (affects stats, dialogue, and challenge types):
   - Architecture — creativity + spatial awareness
   - Engineering/Tech — technical + logic
   - Design/Creative — creativity + communication
   - Commerce/Business — negotiation + finance
3. **Home State** (cosmetic, affects some NPC reactions — dropdown of Indian states)

### Starting Conditions
- Energy: 70/100 (tired from flight)
- Stress: 20/100 (nervous but excited)
- Money: ₹5,000 (parents gave pocket money)
- Phone: 40% battery (affects ability to use maps, call PG owner)
- Inventory: Suitcase, phone, PG address on a piece of paper, ₹500 in loose change

---

## 3. Core Gameplay Loop

```
Wake Up at PG
    │
    ├─→ Check phone (quest updates, messages, news)
    ├─→ Eat breakfast (costs money, restores energy)
    │
    ▼
Explore / Travel
    │
    ├─→ Walk to nearby locations (free, costs energy)
    ├─→ Take auto (costs money, negotiation mini-game)
    ├─→ Take bus (cheap, random encounter chance)
    │
    ▼
Complete Objectives
    │
    ├─→ Main quests (story progression)
    ├─→ Side quests (NPC favors, exploration rewards)
    ├─→ Challenges (interviews, social encounters, QTEs)
    │
    ▼
Manage Resources
    │
    ├─→ Spend money wisely (rent due every 30 in-game days)
    ├─→ Manage stress (too high = debuffs, burnout)
    ├─→ Manage energy (too low = collapse)
    │
    ▼
Return to PG / End Day
    │
    ├─→ Interact with PG-mates (relationship building)
    ├─→ Study/practice skills (skill XP)
    ├─→ Sleep (save game, restore energy, advance day)
    │
    └─→ [Repeat]
```

---

## 4. Detailed Systems Design

### 4.1 Energy System

Energy depletes through activity and is restored through rest and food.

| Action | Energy Cost/Gain |
|--------|-----------------|
| Walking (per 100 tiles) | -2 |
| Running (per 100 tiles) | -5 |
| Taking bus | -5 (crowded, tiring) |
| Taking auto | -2 (comfortable) |
| Challenge/encounter | -10 to -30 |
| Eating (darshini meal) | +20 |
| Eating (PG food) | +15 |
| Chai | +10 |
| Filter coffee | +15 |
| Sleeping (full night) | Full restore to 100 |
| Nap (1 hour) | +25 |

**At 0 Energy**: Player collapses, wakes up at PG, loses half a day, stress +15.

### 4.2 Stress System

Stress accumulates from negative events and is reduced by positive activities.

| Event | Stress Change |
|-------|--------------|
| Job rejection email | +15 |
| Failed interview | +20 |
| Auto driver argument | +10 |
| Rent reminder | +10 |
| Homesick (random event) | +8 |
| Phone call from parents | -10 |
| Hang out with PG-mate | -8 |
| Visit park | -5 |
| Eat favorite food | -5 |
| Achieve quest objective | -10 |
| Get job offer | -30 |

**Stress Thresholds**:
- 0–30: Normal — no effects
- 31–60: Anxious — dialogue options may be less confident, minor stat debuff
- 61–80: Overwhelmed — energy depletes 50% faster, some dialogue locked
- 81–100: Burnout — forced rest day, all stats debuffed for 2 days

### 4.3 Money System

Currency: Indian Rupees (₹). Starting amount: ₹5,000.

**Regular Expenses:**
| Expense | Cost | Frequency |
|---------|------|-----------|
| PG rent | ₹8,000 | Monthly (day 30) |
| Darshini meal | ₹80–150 | Per meal |
| PG food | ₹50 (included if paid up) | Daily |
| Chai | ₹20 | Per cup |
| Auto ride | ₹100–800 | Per ride (negotiable) |
| Bus fare | ₹30 | Per ride |
| Mobile recharge | ₹299 | Monthly |
| Essentials (soap, etc.) | ₹200 | As needed |

**Income Sources:**
| Source | Amount | Availability |
|--------|--------|-------------|
| Freelance gig (side quest) | ₹500–2,000 | Random availability |
| Helping NPC (side quest) | ₹100–500 | Quest reward |
| Part-time work | ₹3,000–5,000 | After unlocking |
| First job salary | ₹25,000+ | After hiring |
| Parents sending money | ₹2,000 | Emergency (one-time, costs pride/stress) |

**At ₹0**: Can still play but limited options. At rent day with insufficient funds: 3-day warning, then eviction game over screen (can reload save).

### 4.4 Skill Trees

Three branches, each with 5 tiers. Each tier requires cumulative XP.

#### Technical Skills
```
Tier 1: Basics (0 XP)        → Can attempt beginner challenges
Tier 2: Intermediate (100 XP) → New dialogue options in tech contexts
Tier 3: Proficient (300 XP)   → Higher success rate in technical interviews
Tier 4: Advanced (600 XP)     → Can mentor others (unlocks side quests)
Tier 5: Expert (1000 XP)      → Special dialogue, highest interview success
```

#### Soft Skills
```
Tier 1: Shy (0 XP)            → Basic conversation options
Tier 2: Friendly (100 XP)     → Unlock networking events
Tier 3: Charismatic (300 XP)  → Better negotiation outcomes
Tier 4: Influential (600 XP)  → Can convince NPCs, unlock leadership quests
Tier 5: Leader (1000 XP)      → Maximum dialogue options, NPC followers
```

#### City Survival
```
Tier 1: Tourist (0 XP)        → Gets lost, pays more for autos
Tier 2: Newcomer (100 XP)     → Basic navigation, knows key spots
Tier 3: Resident (300 XP)     → Better auto prices, knows shortcuts
Tier 4: Local (600 XP)        → NPCs treat you as local, hidden areas unlock
Tier 5: Namma Bengalurean (1000 XP) → Maximum respect, best prices, all secrets
```

---

## 5. Challenge System Details

### 5.1 Auto Negotiation (QTE)

**Trigger**: Interact with auto driver NPC.
**Mechanics**:
1. Driver states inflated price (e.g., ₹800 for a ₹300 ride)
2. Price meter appears — a sliding bar with zones:
   - Red zone (₹700–800): Driver's ideal
   - Yellow zone (₹400–600): Fair-ish
   - Green zone (₹250–350): Great deal
3. Player presses action button to stop the slider
4. Based on where it lands + Negotiation skill level:
   - Green + high skill = lowest price, +XP
   - Yellow = moderate price
   - Red = overpay, stress +5
5. Optional dialogue choices before QTE can shift the meter (e.g., "I know the meter rate" moves green zone wider)

### 5.2 Job Interview (Boss Encounter)

**Structure**: 3-phase encounter with a shared Confidence Meter (0–100%, starts at 50%).

**Phase 1 — Introduction (Dialogue)**
- Interviewer asks questions: "Tell me about yourself", "Why Bangalore?", "Why this company?"
- Player picks from 3–4 responses, each affecting confidence:
  - Great answer: +15 confidence
  - Okay answer: +5 confidence
  - Bad answer: -10 confidence
  - Background-specific bonus answer: +20 confidence (e.g., Architecture grad gets bonus for spatial design question)

**Phase 2 — Technical Test (Puzzle)**
- A timed puzzle mini-game themed to the player's background:
  - Tech: Debug a code snippet (spot-the-error puzzle)
  - Design: Arrange UI elements to match a brief (drag-and-drop)
  - Architecture: Spatial layout puzzle
  - Commerce: Budget allocation challenge
- Completion speed and accuracy affect confidence

**Phase 3 — HR Round (Negotiation)**
- Salary negotiation dialogue
- Player must balance confidence (asking for more) vs. risk (asking too much = rejection)
- Soft skills level affects available options

**Win**: Confidence ≥ 30% at end → Job offer (next day via email)
**Lose**: Confidence < 30% → Rejection email, stress +20, but XP gained from attempt

### 5.3 Networking Event (Memory Game)

**Trigger**: Attend a meetup or event (unlocked via quests).
**Mechanics**:
1. Meet 4–6 NPCs in sequence, each shares name + detail (job, hobby, connection)
2. After meeting all, quiz phase: match names to details
3. Score determines relationship levels:
   - Perfect: All become contacts (future quest givers)
   - Good: Most become contacts
   - Poor: Awkward, stress +5, but still get 1 contact

### 5.4 Bus Rush Hour (Timing Game)

**Trigger**: Take BMTC bus during peak hours.
**Mechanics**:
1. Bus approaches — player must time button press to reach the door
2. Crowding mechanic — press repeatedly to push through
3. Success: Board bus, travel to destination, -5 energy
4. Failure: Miss bus, wait for next one (wastes time), stress +5

---

## 6. NPC Design

### 6.1 Recurring NPCs

| NPC | Location | Role | Personality |
|-----|----------|------|------------|
| Suresh (PG Owner) | PG | Quest giver, landlord | Strict but fair, always mentions rent |
| Priya (PG-mate 1) | PG | Friend, tech worker | Helpful, gives career advice, stressed herself |
| Karthik (PG-mate 2) | PG | Friend, startup dreamer | Optimistic, always pitching ideas, comic relief |
| Deepa (PG-mate 3) | PG | Friend, homesick | Emotional anchor, shares food from home, relatable |
| Raju (Chai Wallah) | Neighborhood | Info source | Knows everything, gossips, gives cryptic advice |
| Kumar (Auto Driver) | Various | Transport + comic relief | Different personality each encounter |
| Ms. Sharma (Interviewer) | Tech Park | First boss | Professional, intimidating, but actually fair |

### 6.2 NPC Interaction Patterns

- **Greeting**: NPCs have time-of-day greetings and mood states
- **Relationship Levels**: 0 (stranger) → 1 (acquaintance) → 2 (friendly) → 3 (friend) → 4 (close friend)
- **Relationship Effects**: Higher levels unlock new dialogue, quests, perks (e.g., Priya at level 3 refers you for a job)
- **Gift System**: Give items to NPCs to increase relationship (chai for anyone, specific foods for specific NPCs)

---

## 7. World Design Principles

### Map Transitions
- **Walking**: Reach map edge → fade transition → new map
- **Auto ride**: Dialogue → fare → cutscene (auto driving through streets) → arrive
- **Bus ride**: Board → short cutscene (looking out window) → arrive
- **Indoor/outdoor**: Door interaction → fade → interior map

### Time System
- **Day/Night Cycle**: Visual only (palette shift), affects NPC availability and some events
- **Day Structure**: Morning (6AM–12PM), Afternoon (12PM–5PM), Evening (5PM–9PM), Night (9PM–6AM)
- **Actions advance time**: Sleeping (to next morning), traveling (30 min–1 hour), challenges (1–2 hours)
- **Some events are time-locked**: Interview at 10AM, meetup at 7PM, rent due on day 30

### Random Events
- Phone call from parents (stress relief)
- Rain (movement slowed, some NPCs go inside, chai stalls busier)
- Traffic jam (auto rides cost more, take longer)
- Festival (special NPCs, decorations, unique items)
- Power cut at PG (can't charge phone, ambient event)

---

## 8. UI/UX Design

### HUD (Always Visible)
```
┌────────────────────────────────────────────────────────────────────────┐
│ [⚡ ████████░░ 70/100]  [😰 ██░░░░░░░░ 15/100]  ₹ 4,850             │
│                                                                        │
│                                                                        │
│                    GAME VIEW (640×360)                                │
│                                                                        │
│                                                                        │
│                                     [📋 Current Objective             │
│                                      Quest text here]                 │
└────────────────────────────────────────────────────────────────────────┘
```
- Top-left: Energy bar (green → yellow → red) with number
- Top-center: Stress bar (blue → orange → red) with number
- Top-right: Money counter (₹ symbol)
- Bottom-right: Current quest objective with icon (collapsible)
- Native resolution: 640×360 (20 tiles wide × 11.25 tall)

### Dialogue Box
```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌────────┐  Suresh (PG Owner)                                      │
│  │ SPRITE │  "The rent is due on the 30th. Don't be late, or       │
│  │ 64×64  │   you'll be sleeping on the street, beta."              │
│  │        │                                                          │
│  └────────┘                                                          │
│                                                                      │
│  > I'll have it ready on time.    □ I'll get it by next week.      │
│    □ Can I pay half now, half later?                                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```
- 9-slice bordered box at bottom of screen (wider and taller)
- Left: 64×64 portrait sprite with facial expression
- Right: Speaker name + typewriter dialogue text (more readable)
- Below: Choice buttons in grid layout (WASD/arrow to navigate, Enter/Space to confirm)
- Box dimensions: ~600×140 pixels, leaving 20px margins
- Text wrapped for readability: max ~60 characters per line

### Pause Menu
- Resume
- Inventory
- Skills
- Quest Log
- Save Game
- Settings (volume, controls)
- Quit to Title

---

## 9. Accessibility

- **Controls**: Keyboard (WASD + arrow keys), mouse click, touch (virtual D-pad + buttons), gamepad
- **Text Speed**: Adjustable typewriter speed or instant text option
- **Font Size**: Pixel font at readable size (minimum 8px at native resolution = 16px+ on screen)
- **Color**: Important information conveyed by both color AND icon/text
- **Screen Reader**: Alt-text for critical UI elements (future improvement)
- **Difficulty**: No explicit difficulty setting; stress/money can be adjusted in settings for accessibility

---

## 10. Localization (Future)

- Primary language: English
- Dialogue uses {variables} for player name and dynamic content
- All text stored in JSON, easy to swap language files
- Kannada signage in pixel art (adds authenticity)
- Future: Hindi, Kannada, Tamil language packs
