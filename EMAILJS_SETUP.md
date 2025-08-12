# EmailJS Setup Instructions

## Quick Setup (5 minutes)

1. **Create Free EmailJS Account**
   - Go to https://www.emailjs.com/
   - Sign up for free account (200 emails/month free)

2. **Add Email Service**
   - In EmailJS dashboard, click "Email Services"
   - Add "Gmail" or "Outlook" service
   - Connect your email account
   - Copy the SERVICE ID

3. **Create Email Template**
   - Click "Email Templates"
   - Create new template
   - Set up template like this:

   **To Email:** support@castawaycovers.com
   
   **Subject:** New Measurement Service Request - {{from_name}}
   
   **Content:**
   ```
   New Measurement Service Request
   
   Customer: {{from_name}}
   Email: {{from_email}}
   Phone: {{phone}}
   
   Address: {{address}}
   
   Furniture Types: {{furniture_types}}
   
   Preferred Date: {{preferred_date}}
   Preferred Time: {{preferred_time}}
   
   Notes: {{notes}}
   ```
   
   - Save and copy the TEMPLATE ID

4. **Get Your Public Key**
   - Go to "Account" → "API Keys"
   - Copy your Public Key

5. **Update Your Code**
   In `/src/app/measurement-service/page.tsx`, replace:
   - `YOUR_SERVICE_ID` with your Service ID
   - `YOUR_TEMPLATE_ID` with your Template ID
   - `YOUR_PUBLIC_KEY` with your Public Key

## That's it!

The form will now send emails to support@castawaycovers.com when submitted.

## Alternative: Use Contact Form Services

If you prefer not to use EmailJS, consider:
- Formspree (https://formspree.io/) - Even simpler setup
- SendGrid - More robust but requires more setup
- Postmark - Great for transactional emails