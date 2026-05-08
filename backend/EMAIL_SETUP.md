# Email Setup for Time Capsule

## Configuration

To enable email notifications when capsules are created, you need to configure the email settings in your `.env` file.

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Time Capsule"
   - Copy the 16-character password

3. **Update `.env` file**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-16-character-app-password
   DEFAULT_FROM_EMAIL=TimeCapsule <noreply@timecapsule.com>
   ```

### Other Email Providers

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
```

## Email Features

### 1. Capsule Creation Notification
When a capsule is created with recipients, they receive:
- ✅ Beautiful HTML email with capsule details
- ✅ Unlock date and time information
- ✅ PIN protection status
- ✅ Calendar reminder suggestion

### 2. Capsule Unlocked Notification (Future)
When a capsule becomes available:
- 🎉 Celebration email
- 🎁 Direct link to open capsule
- 🔐 PIN reminder if applicable

## Testing

To test email functionality:

1. **Create a test capsule** with your email as recipient
2. **Check console logs** for email status:
   - `✅ Email sent successfully to email@example.com`
   - `❌ Failed to send email to email@example.com`

3. **Check your email inbox** for the notification

## Troubleshooting

### Common Issues:

1. **"Authentication failed"**:
   - Check email/password in `.env`
   - For Gmail, use App Password (not regular password)
   - Enable 2-factor authentication

2. **"Connection refused"**:
   - Check EMAIL_HOST and EMAIL_PORT
   - Ensure firewall allows SMTP connections

3. **"SSL/TLS error"**:
   - Set EMAIL_USE_TLS=True for port 587
   - Set EMAIL_USE_TLS=False for port 465

### Debug Mode

Add this to your Django settings to see email debug info:
```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

This will print emails to console instead of sending them.

## Production Notes

- Use environment variables for email credentials
- Consider using a transactional email service (SendGrid, Mailgun) for production
- Set up email domain authentication (SPF, DKIM) for better deliverability
