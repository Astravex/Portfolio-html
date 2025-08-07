# Vercel Deployment Guide for Contact Form

## Problem
Vercel is a static site hosting platform that doesn't support PHP. The original contact form used PHP (`contact-process.php`) which won't work on Vercel.

## Solutions

### Option 1: EmailJS (Recommended)

#### Step 1: Set up EmailJS
1. Go to [EmailJS.com](https://www.emailjs.com/) and create a free account
2. Create a new Email Service (Gmail, Outlook, etc.)
3. Create an email template with variables:
   - `{{from_email}}` - Sender's email
   - `{{from_phone}}` - Sender's phone
   - `{{message}}` - Message content
4. Note down your:
   - Service ID
   - Template ID
   - User ID

#### Step 2: Set Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables:
   ```
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_TEMPLATE_ID=your_template_id
   EMAILJS_USER_ID=your_user_id
   ```

#### Step 3: Deploy
The contact form will now work with the serverless function in `api/contact.js`.

### Option 2: Formspree (Simpler)

#### Step 1: Set up Formspree
1. Go to [Formspree.io](https://formspree.io/) and create a free account
2. Create a new form
3. Copy your form endpoint (looks like `https://formspree.io/f/xaybzwkw`)

#### Step 2: Update Environment Variables
Add to Vercel environment variables:
```
FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

#### Step 3: Use the Simple API
Rename `api/contact-simple.js` to `api/contact.js` to use the Formspree version.

### Option 3: Netlify Forms (Alternative)

If you prefer Netlify over Vercel, you can use Netlify Forms:

1. Add `netlify` attribute to your form:
```html
<form action="javascript:void(0);" class="form-contact" id="form-contact" method="post" netlify>
```

2. Add a hidden input for Netlify:
```html
<input type="hidden" name="form-name" value="contact" />
```

## Files Modified for Vercel

### 1. `vercel.json`
- Configuration for serverless functions
- Routes API requests to the correct function

### 2. `api/contact.js`
- Serverless function to handle form submissions
- Validates input and sends emails via EmailJS

### 3. `asset/js/main.js`
- Updated to use `/api/contact` endpoint
- Sends JSON data instead of form data
- Better error handling

### 4. All HTML Files
- Removed PHP action attributes
- Forms now use JavaScript handling

## Testing

### Local Testing
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel dev`
3. Test the contact form locally

### Production Testing
1. Deploy to Vercel: `vercel --prod`
2. Test the live contact form
3. Check Vercel function logs for any errors

## Troubleshooting

### Common Issues

1. **"Function not found" Error**
   - Ensure `api/contact.js` exists in your project
   - Check that `vercel.json` is properly configured

2. **Environment Variables Not Working**
   - Verify environment variables are set in Vercel dashboard
   - Redeploy after adding environment variables

3. **EmailJS Errors**
   - Check EmailJS credentials are correct
   - Verify email template variables match the code

4. **CORS Errors**
   - Vercel handles CORS automatically for serverless functions
   - If using external services, ensure they allow your domain

### Debugging

1. **Check Vercel Function Logs**
   - Go to Vercel dashboard → Functions
   - Click on your function to see logs

2. **Test API Endpoint**
   ```bash
   curl -X POST https://your-domain.vercel.app/api/contact \
     -H "Content-Type: application/json" \
     -d '{"mail":"test@example.com","phone":"1234567890","message":"Test message"}'
   ```

3. **Check Browser Console**
   - Open browser dev tools
   - Look for JavaScript errors in the console

## Alternative Services

If you prefer not to use EmailJS or Formspree:

1. **SendGrid**: Professional email service
2. **Mailgun**: Email API service
3. **AWS SES**: Amazon's email service
4. **Resend**: Modern email API

## Security Considerations

1. **Rate Limiting**: Consider adding rate limiting to prevent spam
2. **Input Validation**: Already implemented in the serverless function
3. **Environment Variables**: Never commit API keys to your repository
4. **CORS**: Vercel handles this automatically

## Cost Considerations

- **EmailJS**: Free tier includes 200 emails/month
- **Formspree**: Free tier includes 50 submissions/month
- **Vercel**: Free tier includes 100GB-hours of serverless function execution

## Migration from PHP

If you're migrating from a PHP hosting:

1. Remove `asset/contact/contact-process.php` (not needed on Vercel)
2. Update all form actions to use JavaScript
3. Set up one of the email services above
4. Test thoroughly before going live

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test with the provided curl command
4. Check EmailJS/Formspree documentation 