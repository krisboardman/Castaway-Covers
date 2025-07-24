# Google Sheets Email Collection Setup

## Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Castaway Covers - Email Signups"
3. In row 1, add these headers:
   - A1: `Email`
   - B1: `Timestamp`
   - C1: `Source`

## Step 2: Create Google Apps Script
1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Append the data
    sheet.appendRow([
      data.email,
      data.timestamp,
      data.source || 'unknown'
    ]);
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error
    console.error('Error:', error);
    
    // Return error
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (name it "Email Collection Script")

## Step 3: Deploy as Web App
1. Click **Deploy → New Deployment**
2. Click the gear icon and select **Web app**
3. Configure:
   - Description: "Email Collection Webhook"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. **IMPORTANT**: Copy the Web app URL (looks like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

## Step 4: Add to Vercel
1. Go to your Vercel project settings
2. Add environment variable:
   - Key: `GOOGLE_SHEETS_WEBHOOK_URL`
   - Value: [paste the Web app URL from Step 3]
3. Redeploy your site

## Step 5: Test
1. Go to your coming soon page
2. Enter a test email
3. Check your Google Sheet - the email should appear!

## Security Notes
- The Google Apps Script URL is public but only accepts POST requests
- Consider adding validation in the Apps Script
- For production, add rate limiting

## Troubleshooting
- If emails aren't appearing, check the Apps Script logs
- Make sure the deployment is set to "Anyone" for access
- Verify the environment variable is set correctly in Vercel