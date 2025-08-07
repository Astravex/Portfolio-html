# Contact Form System Guide

## Overview
The contact form system allows visitors to send messages directly to your email address through your portfolio website. The system includes both frontend validation and backend processing with security measures.

## Files Involved

### 1. Frontend Files
- **HTML Forms**: All theme files (`index.html`, `home1-v2.html`, etc.) contain the contact form
- **JavaScript**: `asset/js/main.js` - Handles form submission and AJAX requests
- **CSS**: Styling is included in `asset/css/styles.css`

### 2. Backend Files
- **PHP Processor**: `asset/contact/contact-process.php` - Handles form submission and email sending
- **Error Log**: `asset/contact/error_log` - Logs any PHP errors

## Contact Form Structure

### HTML Form
```html
<form action="./asset/contact/contact-process.php" class="form-contact" id="form-contact" method="post">
    <fieldset class="fiel-mail">
        <label class="text-xs-2">Your Email</label>
        <input type="email" name="mail" id="mail" placeholder="Enter the Email" required>
    </fieldset>
    
    <fieldset class="fiel-phone">
        <label class="text-xs-2">Your Phone</label>
        <input type="text" name="phone" id="phone" placeholder="Enter your phone number" required>
    </fieldset>
    
    <fieldset class="fiel-text">
        <label class="text-xs-2">Messenger</label>
        <textarea name="message" id="message" required></textarea>
    </fieldset>
    
    <button type="submit">Get Started</button>
</form>
```

### Form Fields
- **Email** (`mail`): Required, validated for proper email format
- **Phone** (`phone`): Required, length validation (5-20 characters)
- **Message** (`message`): Required, length validation (10-2000 characters)

## Backend Processing

### PHP Logic (`contact-process.php`)
1. **Security Check**: Verifies POST request method
2. **Field Validation**: Checks all required fields are present
3. **Data Sanitization**: Removes potentially harmful content
4. **Email Validation**: Validates email format using PHP's filter_var()
5. **Spam Protection**: Basic length checks on message and phone
6. **Email Sending**: Uses PHP's mail() function to send email
7. **Response**: Returns 'Success' or 'ERROR!' to frontend

### Email Configuration
- **Recipient**: `pierrele0102@gmail.com` (configurable in PHP file)
- **Subject**: "New Contact Form Submission from [email]"
- **Headers**: Properly formatted with From, Reply-To, Content-Type

## Frontend JavaScript

### AJAX Form Submission
```javascript
$("#form-contact").validate({
    submitHandler: function (form) {
        var $form = $(form);
        var str = $form.serialize();
        
        $.ajax({
            type: "POST",
            url: $form.attr("action"),
            data: str,
            success: function (msg) {
                if (msg === "Success") {
                    // Show success message
                } else {
                    // Show error message
                }
            }
        });
    }
});
```

## Security Features

### 1. Input Validation
- Required field validation
- Email format validation
- Length restrictions on inputs
- Data sanitization with stripslashes()

### 2. Request Validation
- POST method verification
- Field presence validation
- Basic spam protection

### 3. Email Security
- Proper email headers formatting
- Content-Type specification
- Reply-To header for easy responses

## Testing the Contact Form

### 1. Manual Testing
1. Open any theme page (e.g., `index.html`)
2. Navigate to the Contact section
3. Fill out the form with valid data
4. Submit and check for success/error messages

### 2. Automated Testing
Use the provided test file:
```bash
# Open test_contact.html in your browser
# Fill out the test form
# Check the result message
```

### 3. Server Requirements
- PHP with mail() function enabled
- Proper server configuration for email sending
- Write permissions for error logging

## Troubleshooting

### Common Issues

1. **"Multiple or malformed newlines" Error**
   - **Cause**: Improper email headers formatting
   - **Solution**: Fixed in current version with proper header formatting

2. **Email Not Sending**
   - **Check**: Server mail configuration
   - **Verify**: PHP mail() function is enabled
   - **Test**: Use test_contact.html

3. **Form Validation Errors**
   - **Check**: All required fields are filled
   - **Verify**: Email format is valid
   - **Ensure**: Message length is between 10-2000 characters

### Error Logging
Check `asset/contact/error_log` for detailed PHP errors and warnings.

## Customization

### Changing Email Address
Edit `asset/contact/contact-process.php`:
```php
$address = "your-email@example.com";
```

### Modifying Validation Rules
Edit the validation section in the PHP file:
```php
// Message length validation
if (strlen($message) < 10 || strlen($message) > 2000) {
    $error = true;
}
```

### Adding New Fields
1. Add field to HTML form
2. Add field name to `$fields` array in PHP
3. Add validation logic
4. Include in email body

## Best Practices

1. **Regular Testing**: Test the contact form regularly
2. **Monitor Logs**: Check error logs for issues
3. **Spam Protection**: Consider adding CAPTCHA for production
4. **Email Filtering**: Set up email filters for contact form submissions
5. **Backup**: Keep backups of the contact form files

## Support

If you encounter issues:
1. Check the error log file
2. Test with the provided test file
3. Verify server PHP and mail configuration
4. Ensure all files are properly uploaded and accessible 