# Deployment Checklist 📋

## Pre-Deployment

### 1. Database Migration
- [ ] Open Supabase SQL Editor
- [ ] Run `supabase/migration-gkr-redesign.sql`
- [ ] Verify columns added: `category`, `quantity`, `unit`, `image_url`, `stock_status`, `notes`
- [ ] Test by adding an item with new fields

### 2. Local Testing
- [ ] Run `npm run build` - should complete successfully ✅ (Already tested)
- [ ] Run `npm run dev` and test all features
- [ ] Test on mobile browser (Chrome for voice input)
- [ ] Check browser console for errors
- [ ] Test offline mode

### 3. Git & GitHub
- [ ] Review all changes: `git status`
- [ ] Stage changes: `git add .`
- [ ] Commit: `git commit -m "GKR-inspired redesign with categories"`
- [ ] Push to GitHub: `git push origin main`
- [ ] Verify push successful on GitHub

## Deployment to Vercel

### Option A: First Time Deploy
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "Add New..." → "Project"
- [ ] Import GitHub repository
- [ ] Add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes for build

### Option B: Redeploy Existing
- [ ] Push to GitHub (done above)
- [ ] Vercel auto-deploys
- [ ] Or: Vercel Dashboard → Deployments → Redeploy

## Post-Deployment Testing

### Basic Functionality
- [ ] Visit Vercel URL
- [ ] Home page loads
- [ ] Store grid displays correctly
- [ ] Click on a store
- [ ] Store page loads with categories
- [ ] Items grouped by category
- [ ] Categories collapsible

### Add Items
- [ ] Click + button
- [ ] Modal opens
- [ ] Can select category from dropdown
- [ ] Can adjust quantity with +/- buttons
- [ ] Can add item
- [ ] Item appears in correct category

### Item Interactions
- [ ] Can check/uncheck items
- [ ] Quantity controls work (+/-)
- [ ] Items show in correct categories
- [ ] "Clear Completed" button works
- [ ] Mode toggle (All Items ↔ Shopping) works

### Voice Input (Chrome only)
- [ ] Voice button visible (bottom-right, brown)
- [ ] Click voice button
- [ ] Microphone permission requested
- [ ] Speak an item name
- [ ] Transcript appears in search or modal

### Mobile Testing
- [ ] Open URL on mobile
- [ ] Responsive layout looks good
- [ ] Touch targets are large enough
- [ ] Can add to home screen (PWA)
- [ ] Works offline

### Visual Checks
- [ ] Warm coral/terracotta colors throughout
- [ ] Cream backgrounds
- [ ] Category icons display
- [ ] Badges show correctly (Running Low, etc.)
- [ ] Smooth transitions and animations
- [ ] No visual glitches

## Troubleshooting

### If build fails:
1. Check Vercel build logs
2. Run `npm run build` locally to see errors
3. Fix TypeScript/build errors
4. Push again

### If database errors:
1. Verify migration ran successfully in Supabase
2. Check environment variables in Vercel
3. Verify Supabase project is active (not paused)
4. Check browser console for specific errors

### If features don't work:
1. Check browser console for JavaScript errors
2. Verify all components imported correctly
3. Check API routes exist and respond
4. Verify environment variables set correctly

## Success Criteria ✅

Your deployment is successful when:
- ✅ App loads without errors
- ✅ Can create/view stores
- ✅ Can add items with categories
- ✅ Items display in category sections
- ✅ Can check/uncheck items
- ✅ Can adjust quantities
- ✅ Voice button appears (Chrome)
- ✅ Mobile responsive
- ✅ Can install as PWA

## Post-Launch

### Immediate
- [ ] Share URL with test users
- [ ] Monitor Vercel logs for errors
- [ ] Test on different devices/browsers
- [ ] Add real shopping data

### Within 24 Hours
- [ ] Check Vercel analytics
- [ ] Review any error logs
- [ ] Gather user feedback
- [ ] Note any bugs or issues

### Ongoing
- [ ] Regular usage to test stability
- [ ] Monitor Vercel/Supabase free tier usage
- [ ] Plan future enhancements
- [ ] Keep dependencies updated

## Rollback Plan

If something goes wrong:

1. **Vercel**: 
   - Deployments → Find previous working deployment
   - Click "..." → "Promote to Production"

2. **Database**:
   - Supabase → SQL Editor → Restore from backup
   - Or manually revert migration:
   ```sql
   ALTER TABLE items 
   DROP COLUMN IF EXISTS category,
   DROP COLUMN IF EXISTS quantity,
   DROP COLUMN IF EXISTS unit,
   DROP COLUMN IF EXISTS image_url,
   DROP COLUMN IF EXISTS stock_status,
   DROP COLUMN IF EXISTS notes;
   ```

## Resources

- **Deployment Guide**: See `DEPLOYMENT.md`
- **Changes Summary**: See `GKR-REDESIGN-SUMMARY.md`
- **Migration SQL**: `supabase/migration-gkr-redesign.sql`

## Support

If stuck:
- Check Vercel deployment logs
- Check browser console errors
- Review Supabase logs
- See DEPLOYMENT.md troubleshooting section

---

**Good luck with your deployment! 🚀**

**Estimated Time**: 15-30 minutes (if everything goes smoothly)
