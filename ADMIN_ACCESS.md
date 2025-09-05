# Admin Access for Castaway Covers

## Access URLs

### For Admin (30-day access)
- **URL**: https://castawaycovers.com?preview=kbadmin2025
- This gives you 30-day access that auto-renews each time you visit with this URL
- Use this for yourself as the site owner

### For Preview Sharing (24-hour access)
- **URL**: https://castawaycovers.com?preview=castaway2025
- This gives temporary 24-hour access
- Share this with clients, contractors, or anyone who needs temporary access

## How It Works

1. **Admin Access**: When you visit with `?preview=kbadmin2025`, the site sets two cookies:
   - `preview-mode=true` (30 days)
   - `admin-access=true` (30 days)
   
2. **Regular Preview**: When someone visits with `?preview=castaway2025`, they get:
   - `preview-mode=true` (24 hours only)

3. **Cookie Renewal**: Admin cookies automatically renew to 30 days whenever you visit with the admin URL

## If You Get Locked Out

Simply visit: https://castawaycovers.com?preview=kbadmin2025

This will restore your access for another 30 days.

## To Disable Coming Soon Mode

When you're ready to launch:
1. Edit `/src/components/ComingSoonRedirect.tsx`
2. Change line 11: `const COMING_SOON_ENABLED = true;` to `false`
3. Deploy the changes

## Security Note

Keep the admin token (`kbadmin2025`) private. Only share the regular preview token (`castaway2025`) with others.