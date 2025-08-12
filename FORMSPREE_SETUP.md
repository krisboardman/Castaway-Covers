# Formspree Setup (Alternative to EmailJS)

Formspree is simpler than EmailJS - no email server configuration needed!

## Quick Setup (2 minutes)

1. **Sign up at https://formspree.io/**
   - Free plan includes 50 submissions/month

2. **Create a new form**
   - Click "New Form"
   - Name it "Measurement Service"
   - It will give you a form endpoint like: `https://formspree.io/f/YOUR_FORM_ID`

3. **Update the measurement service page**
   Replace the handleSubmit function in `/src/app/measurement-service/page.tsx`:

```javascript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, NJ ${formData.zipCode}`,
        furnitureTypes: formData.furnitureTypes.join(', '),
        preferredDate: formData.preferredDate || 'Not specified',
        preferredTime: formData.preferredTime || 'Not specified',
        notes: formData.notes || 'None',
      }),
    });

    if (response.ok) {
      alert('Thank you! We\'ll contact you within 24 hours to confirm your appointment and process payment.');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        furnitureTypes: [],
        preferredDate: '',
        preferredTime: '',
        notes: ''
      });
    } else {
      alert('There was an error. Please email us directly at support@castawaycovers.com');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('There was an error. Please email us directly at support@castawaycovers.com');
  }
};
```

4. **Remove EmailJS code**
   - Delete the Script tag loading EmailJS
   - Remove the EmailJS initialization code

## Benefits over EmailJS
- No email server configuration
- Works immediately
- Formspree handles all email delivery
- You get form submissions sent to your email
- Built-in spam protection
- Form submission history in dashboard