# 🎨 Visual Animation Guide

## XP Floating Animation

### Animation Flow

```
Initial State (t=0s)
    ↓
┌─────────────────┐
│     +50 XP      │  ← Appears at center (scale 0.8, opacity 0)
│       ⚡        │
└─────────────────┘
    ↓ (0.1s)
┌─────────────────┐
│     +50 XP      │  ← Scales to 1.0, opacity 1
│       ⚡        │
└─────────────────┘
    ↓ (floats up)
┌─────────────────┐
│     +50 XP      │  ← Floats up 100px
│       ⚡        │
└─────────────────┘
    ↓ (2.5s)
       fade out     ← Scales to 0.8, opacity 0, auto-destroys
```

### Color Coding

```
 1-10 XP  →  🟢 text-green-400   (Small gains)
11-50 XP  →  🔵 text-blue-400    (Medium gains)
51-100 XP →  🟣 text-violet-400  (Large gains)
101+ XP   →  🟡 text-amber-400   (Huge gains!)
```

### Visual Example

```
User clicks "Atualizar Progresso" on a goal
    ↓
[API Call Success] updatedGoal.xpReward = 75
    ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                         ┃
┃              💜 +75 XP ⚡               ┃  ← Appears at (window.innerWidth/2, window.innerHeight/2)
┃         [Violet color, large]          ┃
┃                                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    ↓ [floats up smoothly]
    ↓
    ↓ [fades out after 2.5s]
```

---

## Confetti Celebration

### Particle Generation

```
Level up detected! (competency newLevel > oldLevel)
    ↓
Generate 80 confetti pieces:
  - 40 violet (#8b5cf6)
  - 40 amber (#f59e0b)
    ↓
Random properties for each piece:
  - left: random 0-100vw
  - animationDelay: random 0-0.3s
  - animationDuration: random 3-4s
```

### Visual Example

```
User updates competency from Level 2 → Level 3
    ↓
[API Call Success] levelUp = true
    ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🟣           🟡      🟣                          ┃
┃       🟡  🟣              🟡   🟣                 ┃
┃                                                   ┃  ← 80 pieces falling
┃    🟣      🟡        🟣             🟡   🟣       ┃     from top to bottom
┃                  🟣      🟡                       ┃     spinning as they fall
┃                                                   ┃
┃        💜 +100 XP ⚡                              ┃  ← XP animation at center
┃                                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    ↓ [confetti falls and fades]
    ↓ [auto-cleanup after 4s]
```

---

## Combined Effects (Level Up)

### Timeline

```
t=0.0s  →  User clicks "Atualizar" on competency
t=0.2s  →  API responds with success
t=0.3s  →  🎯 XP animation appears
t=0.3s  →  🎉 Confetti starts falling (80 pieces)
t=0.4s  →  🔔 Toast notification appears
t=2.8s  →  ✅ XP animation fades out
t=4.3s  →  ✅ Confetti cleanup complete
t=4.4s  →  ✅ Toast auto-dismisses
```

### Full Experience

```
════════════════════════════════════════════════════
         COMPETENCY LEVEL UP CELEBRATION
════════════════════════════════════════════════════

[Before Level Up]
┌─────────────────────────────────────────────────┐
│ 🧠 TypeScript - Level 2                         │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░ 50%                       │
│ [Atualizar Progresso] 📈                        │
└─────────────────────────────────────────────────┘

[User clicks "Atualizar Progresso", sets Level 3]
       ↓ [API call]
       ↓ [Success response]

[Celebration Effects]
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🟣  🟡    🟣      🟡   🟣    🟡      🟣   🟡  ┃
┃       🟡  🟣    🟡    🟣   🟡   🟣     🟡      ┃
┃                                                 ┃
┃                💜 +100 XP ⚡                    ┃  ← Floating XP
┃                                                 ┃
┃    🟣      🟡        🟣      🟡       🟣        ┃
┃        🟡       🟣        🟡     🟣       🟡    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

[Toast Notification - Bottom Right]
┌─────────────────────────────────────────────────┐
│ 🎉 Level up!                                    │
│ Agora você está no nível 3                      │
│                                          [✕]    │
└─────────────────────────────────────────────────┘

[After Effects (4s later)]
┌─────────────────────────────────────────────────┐
│ 🧠 TypeScript - Level 3                         │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░ 75%                       │
│ [Atualizar Progresso] 📈                        │
└─────────────────────────────────────────────────┘

User sees:
✅ Immediate XP gain feedback (floating +100 XP)
✅ Celebration confetti (80 pieces, violet/amber)
✅ Toast confirmation
✅ Updated competency level and progress bar
```

---

## Activity Creation Example (1:1 Meeting)

```
User clicks "1:1" Quick Action
    ↓
Fills form (title, date, topics, action items)
    ↓
Clicks "Salvar"
    ↓
[API Call] createOneOnOne()
    ↓
[Success Response] activity.xpEarned = 30
    ↓
════════════════════════════════════════════════════

[Visual Feedback]
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                 ┃
┃                                                 ┃
┃                🔵 +30 XP ⚡                     ┃  ← Blue (medium gain)
┃                                                 ┃
┃                                                 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

[Toast Notification]
┌─────────────────────────────────────────────────┐
│ ✅ 1:1 Criado                                   │
│ +30 XP ganho! Reunião 1:1 registrada 👥         │
│                                          [✕]    │
└─────────────────────────────────────────────────┘

[Activities Timeline Updated]
┌─────────────────────────────────────────────────┐
│ ⏰ TIMELINE                                      │
├─────────────────────────────────────────────────┤
│ 🕐 1:1 Meeting - Team Sync                      │ ← NEW
│    With: Manager | +30 XP                       │
│    Topics: Q4 Goals, Feedback                   │
├─────────────────────────────────────────────────┤
│ 📚 Previous activities...                       │
└─────────────────────────────────────────────────┘
```

---

## Goal Progress Update Example

```
User clicks 📊 icon on a goal card
    ↓
Modal opens: "Atualizar Progresso"
    ↓
Updates currentValue: 7/10 → 8/10
    ↓
Clicks "Atualizar"
    ↓
[API Call] updateGoalProgress()
    ↓
[Success Response] updatedGoal.xpReward = 50
    ↓
════════════════════════════════════════════════════

[Visual Feedback]
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                 ┃
┃                                                 ┃
┃                🔵 +50 XP ⚡                     ┃  ← Blue (medium gain)
┃                                                 ┃
┃                                                 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

[Toast Notification]
┌─────────────────────────────────────────────────┐
│ ✅ Progresso Atualizado                         │
│ +50 XP ganho! Continue assim! 🔥                │
│                                          [✕]    │
└─────────────────────────────────────────────────┘

[Goal Card Updated]
┌─────────────────────────────────────────────────┐
│ 🎯 Complete 10 Code Reviews                     │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░ 8/10 (80%)               │  ← Progress updated
│ 50 XP | Deadline: 30 Nov                        │
│ [📊 Atualizar]                                  │
└─────────────────────────────────────────────────┘
```

---

## Animation Performance

### CSS vs JavaScript

```
┌──────────────────┬─────────────┬─────────────┐
│     Metric       │    CSS      │     JS      │
├──────────────────┼─────────────┼─────────────┤
│ Frame Rate       │   60 FPS    │   30-45 FPS │
│ CPU Usage        │   Low       │   Medium    │
│ GPU Acceleration │   ✅ Yes    │   ❌ No     │
│ Smooth on 80+    │   ✅ Yes    │   ❌ Laggy  │
│ Main Thread      │   ✅ Free   │   ❌ Blocked│
└──────────────────┴─────────────┴─────────────┘
```

### Why CSS for Confetti?

- 80 particles × 60 FPS × 4 seconds = **19,200 frames**
- CSS: GPU-accelerated, no JavaScript execution
- JS: Would require 19,200 calculations on main thread
- Result: **Smooth, buttery 60 FPS** with CSS

---

## Browser Rendering

### XP Floating (GPU Layer)

```
Browser Rendering Pipeline:
┌──────────────────────────────────────┐
│  JavaScript (triggers animation)     │
└──────────────────────────────────────┘
             ↓
┌──────────────────────────────────────┐
│  CSS Animation (transform, opacity)  │  ← GPU accelerated
└──────────────────────────────────────┘
             ↓
┌──────────────────────────────────────┐
│  Composite Layer (no repaint)        │  ← Hardware accelerated
└──────────────────────────────────────┘
             ↓
        [Smooth 60 FPS]
```

### Confetti (CSS-only)

```
Browser Rendering Pipeline:
┌──────────────────────────────────────┐
│  React creates 80 <div> elements     │
└──────────────────────────────────────┘
             ↓
┌──────────────────────────────────────┐
│  CSS animation starts immediately    │  ← No JavaScript!
└──────────────────────────────────────┘
             ↓
┌──────────────────────────────────────┐
│  GPU renders all 80 particles        │  ← Parallel processing
└──────────────────────────────────────┘
             ↓
        [Smooth 60 FPS]
```

---

## Testing the Animations

### How to Test

1. **Start Development Server:**

   ```bash
   cd frontend && npm run dev
   ```

2. **Navigate to:** http://localhost:5173/development

3. **Test XP Animation:**

   - Click "Atualizar Progresso" on any goal
   - Update the progress value
   - Click "Atualizar"
   - **Expected:** Blue +XP animation floats up at center of screen

4. **Test Confetti:**

   - Click competency card to update
   - **Increase the level** (e.g., Level 2 → Level 3)
   - Click "Atualizar"
   - **Expected:** Violet/amber confetti falls + +XP animation

5. **Test Activity XP:**
   - Click "1:1" Quick Action
   - Fill form and save
   - **Expected:** Blue +30 XP animation

---

## Known Behavior

### XP Animation Position

- Always appears at `(window.innerWidth/2, window.innerHeight/2)`
- This ensures it's always visible regardless of scroll position
- Can be customized to trigger at button location in future

### Confetti Timing

- Starts immediately on level up detection
- Runs for 4 seconds
- Auto-cleanup prevents multiple confetti layers

### Multiple Animations

- **Supported:** Multiple XP animations can run simultaneously
- **Example:** User rapidly creates 3 activities → 3 XP animations appear
- **No conflicts:** Each has unique ID and cleanup timer

---

## Future Enhancements

### XP Animation at Click Position

```typescript
// Current: Always at center
triggerXpAnimation(xp, window.innerWidth / 2, window.innerHeight / 2);

// Future: At button click position
const handleClick = (e: React.MouseEvent) => {
  triggerXpAnimation(xp, e.clientX, e.clientY);
};
```

### Custom Confetti Presets

```typescript
// Achievement unlocked
<AchievementConfetti /> // Rainbow colors, 50 pieces

// Streak milestone
<StreakConfetti /> // Fire colors, 100 pieces

// Goal completed
<GoalConfetti /> // Green/blue, 60 pieces
```

---

**Status:** ✅ All animations implemented and ready for testing!
