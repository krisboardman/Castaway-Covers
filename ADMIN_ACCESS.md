# Admin Access for Castaway Covers

## Access URLs

### For Admin (7-day access via middleware)
- **URL**: https://castawaycovers.com/?admin=castaway-admin-2025
- This gives you 7-day access that persists via cookie
- Use this for yourself as the site owner
- The cookie auto-renews each time you visit with this URL

### Alternative Admin Access (30-day access - if client-side redirect is re-enabled)
- **URL**: https://castawaycovers.com?preview=kbadmin2025
- This method works with the client-side ComingSoonRedirect component (currently disabled)

### For Preview Sharing (24-hour access - if client-side redirect is re-enabled)
- **URL**: https://castawaycovers.com?preview=castaway2025
- This gives temporary 24-hour access
- Share this with clients, contractors, or anyone who needs temporary access
- Note: This only works if ComingSoonRedirect is re-enabled in layout.tsx

## How It Works (Current Middleware Implementation)

1. **Middleware-based Redirect**: The site now uses Next.js middleware for server-side redirects
   - More reliable and works before the page loads
   - Checks for `?admin=castaway-admin-2025` parameter
   - Sets an `admin-access` cookie for 7 days
   
2. **Cookie Persistence**: Once you've accessed with the admin URL:
   - You can browse normally for 7 days
   - The cookie renews whenever you use the admin URL again

3. **Coming Soon Page**: All visitors without admin access are redirected to `/coming-soon`

## If You Get Locked Out

Simply visit: https://castawaycovers.com/?admin=castaway-admin-2025

This will restore your access for another 7 days.

## To Disable Coming Soon Mode

When you're ready to launch the full site:

1. Edit `/src/middleware.ts`
2. Change line 9: `const COMING_SOON_ENABLED = true` to `false`
3. Deploy the changes

## Testing

- **Test as a visitor**: Use an incognito/private browser window
- **Test admin access**: Use the admin URL above
- **Clear access**: Clear your browser cookies for the domain

## Security Note

Keep the admin token (`castaway-admin-2025`) private. Only share with trusted administrators.