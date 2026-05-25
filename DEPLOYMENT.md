# Deployment Guide

This guide walks you through deploying your Shopping List App to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase project already set up (from README.md)

## Quick Deployment (5 minutes)

### Step 1: Push to GitHub

```bash
cd shopping-list-app

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Shopping List App"

# Create GitHub repo and push
# (Replace YOUR_USERNAME with your GitHub username)
gh repo create shopping-list-app --public --source=. --remote=origin --push
```

Or manually:
1. Create new repo on GitHub: https://github.com/new
2. Name it `shopping-list-app`
3. Push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/shopping-list-app.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your `shopping-list-app` repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variables** (CRITICAL):
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   (Copy from your `.env.local` file)

6. Click "Deploy"

### Step 3: Wait for Build

- Build takes ~2-3 minutes
- Vercel will show build logs
- When complete, you'll see: "Your project is ready!"

### Step 4: Access Your App

- Vercel provides a URL: `https://shopping-list-app-xxxxx.vercel.app`
- Click the URL to open your app
- Test on mobile by visiting the URL on your phone

## Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your domain (e.g., `myshoppinglist.com`)
3. Follow DNS configuration instructions
4. Vercel auto-provisions SSL certificate

## PWA Installation on Mobile

**iPhone (Safari)**:
1. Open your Vercel URL in Safari
2. Tap Share button → "Add to Home Screen"
3. Name it "Shopping List"
4. Tap "Add"

**Android (Chrome)**:
1. Open your Vercel URL in Chrome
2. Tap menu (3 dots) → "Add to Home screen"
3. Name it "Shopping List"
4. Tap "Add"

Now you can open the app from your home screen like a native app!

## Continuous Deployment

Vercel automatically deploys on every push to `main`:

```bash
# Make changes to your code
git add .
git commit -m "Add feature X"
git push

# Vercel auto-deploys in ~2 minutes
```

## Environment Variables Updates

To update Supabase credentials or other env vars:

1. Go to Vercel project → Settings → Environment Variables
2. Edit the variable
3. Redeploy: Deployments → ⋯ → Redeploy

## Monitoring & Logs

**View logs**:
- Vercel Dashboard → Your Project → Deployments → Click deployment → Logs

**Monitor usage** (free tier limits):
- 100 GB bandwidth/month
- 100 GB-hours serverless function execution
- 6,000 build minutes/month

Your app should stay well within free tier limits for personal use.

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Check `package.json` includes all dependencies
- Run `npm install` locally to verify

**Error: "Environment variables missing"**
- Verify you added `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check spelling and format (no quotes needed in Vercel UI)

### App Works Locally But Not on Vercel

**Database connection fails**:
- Check Supabase RLS policies are enabled
- Verify environment variables in Vercel match `.env.local`
- Check Supabase project is not paused (free tier auto-pauses after 7 days inactivity)

**Voice input not working**:
- Voice only works on HTTPS (Vercel provides this automatically)
- Chrome/Edge only (Safari doesn't support Web Speech API)
- Check microphone permissions in browser

### PWA Not Installable

- Ensure app is served over HTTPS (Vercel does this automatically)
- Check `/manifest.json` is accessible at your Vercel URL
- Verify service worker registers (DevTools → Application → Service Workers)

## Free Tier Limits

**Vercel**:
- 100 GB bandwidth/month
- 100 GB-hours compute/month
- Unlimited deployments

**Supabase**:
- 500 MB database storage
- 2 GB file storage
- 50,000 monthly active users
- Auto-pauses after 7 days inactivity (just visit to wake up)

For personal use, free tier is more than sufficient.

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

## Security Notes

- Never commit `.env.local` to git (already in `.gitignore`)
- Rotate Supabase keys if accidentally exposed
- For multi-user apps, implement proper authentication (Supabase Auth)
