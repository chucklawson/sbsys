# AWS SES Setup Instructions

The contact form now uses AWS SES (Simple Email Service) to send emails directly from the application.

## Required Setup Steps

### 1. Deploy the Backend Changes

Run the following command to deploy the new Lambda function and API:

```bash
npx ampx sandbox
```

Or for production:

```bash
npx ampx deploy
```

### 2. Verify Email Address in AWS SES

Before you can send emails, you must verify the sender email address in AWS SES:

1. Go to the AWS Console
2. Navigate to **Amazon SES** (Simple Email Service)
3. Click on **Verified identities** in the left menu
4. Click **Create identity**
5. Select **Email address**
6. Enter: `sciotobussys@gmail.com`
7. Click **Create identity**
8. Check the email inbox for `sciotobussys@gmail.com`
9. Click the verification link in the email from AWS

### 3. (Optional) Move Out of SES Sandbox

By default, AWS SES is in "sandbox mode" which means:
- You can only send emails TO verified addresses
- Limited sending quota

To send emails to any address:

1. In the AWS SES console, click **Account dashboard**
2. Look for the "Production access" section
3. Click **Request production access**
4. Fill out the form explaining your use case
5. Wait for AWS approval (usually 24 hours)

### 4. Test the Contact Form

1. Make sure your backend is deployed
2. Go to the Contact page in your app
3. Click "Request Information"
4. Fill out the form
5. Click "Send"
6. Check the sciotobussys@gmail.com inbox for the email

## Troubleshooting

- **"Email address not verified"**: Make sure you clicked the verification link in the email
- **"Sending quota exceeded"**: You may be in sandbox mode with limits
- **No email received**: Check spam folder, and verify the Lambda function has SES permissions
