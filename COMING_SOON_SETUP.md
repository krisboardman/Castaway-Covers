# Coming Soon Mode Setup

## Quick Setup in Vercel

1. Go to your Vercel Dashboard
2. Select your Castaway Covers project
3. Go to Settings → Environment Variables
4. Add these variables:
   - `COMING_SOON_MODE` = `true` (to enable coming soon)
   - `PREVIEW_TOKEN` = `your-secret-token` (e.g., `castaway2024preview`)

## How to Use

### From Your Mobile:
1. Visit: `https://castawaycovers.com/admin-toggle`
2. Password: `castaway2024`
3. Toggle between Coming Soon and Live modes
4. Use the Preview URL to show people your site without going live

### Preview URL:
- Share this URL to let specific people see the live site
- Format: `https://castawaycovers.com?preview=your-secret-token`
- Valid for 24 hours (cookie-based)

### To Go Live:
1. Set `COMING_SOON_MODE` = `false` in Vercel
2. Or remove the environment variable entirely

## Features:
- Coming soon page with email capture
- Preview mode for demonstrations
- Mobile-friendly admin toggle
- Cookie-based preview sessions

## Security Note:
For production, consider:
- Changing the admin password
- Using a more secure authentication method
- Storing emails in a proper database