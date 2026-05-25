# Shopping List App

A mobile-optimized web application for managing shopping lists across three stores (Indian Store, Sainsbury's, Costco) with voice input, smart suggestions, and offline support.

## Features

- 📝 Store-specific shopping lists with pre-populated items
- 🎤 Voice input for hands-free item addition (Chrome)
- 🤖 Smart suggestions based on purchase frequency and favorites
- 📱 Mobile-first PWA (installable on home screen)
- 🔄 Real-time cross-device sync
- ⚡ Offline support with sync on reconnection
- ⭐ Mark items as favorites for quick access

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Voice:** Web Speech API

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier)
- Vercel account (free tier)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd shopping-list-app
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for provisioning (~2 minutes)
3. Go to SQL Editor and run the migration:
   ```bash
   cat supabase/migrations/001_initial_schema.sql
   ```
   Copy and paste into Supabase SQL Editor, then click "Run"
4. Go to Settings → API and copy:
   - Project URL
   - anon public key

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables (same as `.env.local`)
4. Deploy
5. Access your app at `https://your-app.vercel.app`

### 6. Install as PWA (Optional)

**On Chrome mobile:**
1. Open your deployed app
2. Tap browser menu → "Add to Home screen"
3. Open from home screen icon for app-like experience

## Usage

### Adding Items
- **Text:** Tap "+" button, type item name, tap "Add"
- **Voice (Chrome only):** Tap "+", tap microphone, speak item name

### Shopping Mode
- Toggle between "All Items" and "Shopping" tabs
- Shopping mode shows only unchecked items
- Smart suggestions appear in Shopping mode

### Favorites
- Tap star icon to mark item as favorite
- Favorites always appear in suggestions

### Offline Mode
- App works offline for viewing and checking items
- Changes sync automatically when connection restored

## API Endpoints

- `GET /api/stores` - Fetch all stores with unchecked counts
- `GET /api/stores/[storeId]/items` - Get items for a store
- `POST /api/items` - Add new item
- `POST /api/items/[itemId]/check` - Mark item as checked
- `POST /api/items/[itemId]/uncheck` - Mark item as unchecked
- `PATCH /api/items/[itemId]/favorite` - Toggle favorite status
- `GET /api/stores/[storeId]/suggestions` - Get smart suggestions

## Database Schema

- `stores` - Store information (Indian Store, Sainsbury's, Costco)
- `items` - Shopping items with store association
- `item_actions` - History of check/uncheck actions for pattern learning

## Troubleshooting

**Voice input not working:**
- Ensure you're using Chrome browser
- Check microphone permissions in browser settings
- Voice input only works on HTTPS (or localhost)

**Items not syncing:**
- Check network connection
- Verify Supabase credentials in environment variables
- Check browser console for API errors

**PWA not installable:**
- Ensure app is served over HTTPS
- Check `manifest.json` is accessible at `/manifest.json`
- Verify service worker is registered (DevTools → Application → Service Workers)

## Future Enhancements

- Meal prep suggestions based on ingredients
- Time-based purchasing patterns
- Quantity tracking
- Price tracking
- Shared lists (multi-user)
- Barcode scanning

## License

MIT
