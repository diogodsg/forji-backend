# Gamification System - Phase 1 Implementation

## 🎮 Overview

This is the Phase 1 implementation of the Forji gamification system, transforming the platform into an engaging team management and development experience. Players earn XP, unlock badges, and compete on leaderboards while collaborating and growing professionally.

## 🏗️ Architecture

### Backend Structure

```
backend/src/
├── gamification/
│   ├── gamification.module.ts      # Main module
│   ├── gamification.service.ts     # Core logic
│   ├── gamification.controller.ts  # API endpoints
│   └── types/                      # Type definitions
```

### Frontend Structure

```
frontend/src/features/gamification/
├── components/
│   ├── PlayerCard.tsx              # Player profile display
│   ├── BadgeComponent.tsx          # Badge display with rarity
│   ├── Leaderboard.tsx            # Rankings and trends
│   ├── GamificationDashboard.tsx  # Main dashboard
│   ├── XPNotification.tsx         # Real-time notifications
│   └── GamificationWidget.tsx     # Compact widget
├── hooks/
│   ├── useGamification.ts         # API integration
│   └── useXPNotifications.ts      # Notification system
├── context/
│   └── GamificationContext.tsx    # Global state
├── types/
│   └── gamification.ts           # TypeScript definitions
└── index.ts                      # Public exports
```

### Database Schema

```sql
-- Gamification profiles for each user
GamificationProfile {
  id         BigInt   @id @default(autoincrement())
  userId     BigInt   @unique
  totalXP    Int      @default(0)
  level      Int      @default(1)
  title      String   @default("Rookie")
  weeklyXP   Int      @default(0)
  monthlyXP  Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

-- User badge relationships
UserBadge {
  id        BigInt   @id @default(autoincrement())
  userId    BigInt
  badgeId   String
  earnedAt  DateTime @default(now())
}

-- XP transaction history
XpHistory {
  id          BigInt   @id @default(autoincrement())
  userId      BigInt
  points      Int
  action      String
  description String?
  createdAt   DateTime @default(now())
}
```

## 📡 API Endpoints

### GET `/gamification/profile`

Get current user's gamification profile

```json
{
  "userId": 1,
  "totalXP": 1250,
  "level": 12,
  "title": "Senior Developer",
  "weeklyXP": 200,
  "monthlyXP": 800,
  "xpToNextLevel": 50,
  "badges": [...]
}
```

### GET `/gamification/leaderboard`

Get leaderboard rankings

```json
[
  {
    "userId": 1,
    "name": "Alice Smith",
    "totalXP": 2500,
    "level": 25,
    "weeklyXP": 300,
    "rank": 1,
    "trend": "up"
  }
]
```

### POST `/gamification/xp/manual`

Add XP manually (for testing)

```json
{
  "action": "pdi_milestone_completed",
  "points": 100
}
```

## 🎯 XP System

### Automatic XP Actions

- `daily_activity`: +10 XP (daily login, basic activity)
- `pdi_milestone_completed`: +100 XP (completing PDI milestones)
- `peer_feedback_given`: +25 XP (providing feedback to teammates)
- `team_collaboration`: +50 XP (collaborative activities)
- `knowledge_sharing`: +100 XP (sharing knowledge, mentoring)

### Level Calculation

- **Formula**: `level = floor(sqrt(totalXP / 10)) + 1`
- **Progression**: Exponential curve requiring more XP for higher levels
- **Titles**: Automatically assigned based on level ranges

## 🏆 Badge System

### Badge Categories

1. **Development** (🔧): Technical achievements
2. **Leadership** (👑): Leadership and management
3. **Collaboration** (🤝): Teamwork and communication
4. **Consistency** (📈): Regular activity and dedication

### Rarity Levels

- **Common**: Green gradient, basic achievements
- **Rare**: Blue gradient, significant milestones
- **Epic**: Purple gradient, major accomplishments
- **Legendary**: Pink-purple gradient, exceptional feats

## 🎨 Component Usage

### GamificationWidget

Compact display for user stats:

```tsx
import { GamificationWidget } from '@/features/gamification';

// Full widget
<GamificationWidget />

// Compact version
<GamificationWidget compact showBadges={false} />
```

### PlayerCard

Detailed player profile:

```tsx
import { PlayerCard } from "@/features/gamification";

<PlayerCard profile={profile} showFullStats className="max-w-md" />;
```

### Leaderboard

Rankings display:

```tsx
import { Leaderboard } from "@/features/gamification";

<Leaderboard
  entries={leaderboard}
  currentUserId={userId}
  showWeeklyXP
  title="🏆 Top Players"
/>;
```

## 🔧 Setup & Integration

### 1. Database Setup

```bash
cd backend
npm run prisma:migrate:dev -- --name "add_gamification"
npm run prisma:seed
```

### 2. Provider Setup

```tsx
// In your main App.tsx
import { GamificationProvider } from "@/features/gamification";

function App() {
  return <GamificationProvider>{/* Your app content */}</GamificationProvider>;
}
```

### 3. Navigation Integration

```tsx
// Add to your navigation
import GamificationPage from "@/pages/GamificationPage";

// Router setup
<Route path="/gamification" element={<GamificationPage />} />;
```

## 🧪 Testing

### Manual XP Testing

Use the test controls in `GamificationDashboard` to simulate XP gains:

1. Select an action type
2. Optionally set custom points
3. Click the + button to add XP
4. Watch notifications and profile updates

### Sample Test Data

The system includes seed data with:

- 3 test users with different XP levels
- Various badges across all categories
- Sample XP history transactions

## 🚀 Phase 1 Features Complete

✅ **Core XP System**: Earning, tracking, and level calculation  
✅ **Badge System**: 20+ predefined badges across 4 categories  
✅ **Leaderboard**: Rankings with trends and weekly stats  
✅ **Real-time Notifications**: XP gains, level ups, badge unlocks  
✅ **Responsive UI**: Mobile-friendly components with TailwindCSS  
✅ **TypeScript**: Full type safety across frontend and backend

## 🔮 Next Phases

### Phase 2: Advanced Engagement (Weeks 5-8)

- Team challenges and competitions
- Achievement streaks and combos
- Seasonal events and limited badges
- Advanced analytics dashboard

### Phase 3: Social Features (Weeks 9-12)

- Team formation and management
- Peer recognition system
- Social feeds and activity streams
- Mentorship matching

### Phase 4: Advanced Analytics (Weeks 13-16)

- Predictive engagement models
- Performance correlation analysis
- Custom goal setting
- Management insights dashboard

## 💡 Contributing

When adding new features:

1. Define XP actions in `gamification.service.ts`
2. Create badge definitions with proper metadata
3. Add TypeScript interfaces for new data structures
4. Include loading and error states in components
5. Write integration tests for API endpoints

## 🎮 Start Playing!

Visit `/gamification` to see your player profile, earn XP through daily activities, and climb the leaderboards! The system automatically tracks your progress and rewards engagement across the platform.
