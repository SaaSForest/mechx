<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - MechX</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo h1 {
            color: #FF5500;
            font-size: 32px;
            margin: 0;
        }
        h2 {
            color: #1a1a1a;
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            font-size: 16px;
            margin-bottom: 16px;
        }
        .code-box {
            background-color: #1a1a1a;
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            margin: 24px 0;
        }
        .code {
            color: #FF5500;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 4px;
            font-family: monospace;
        }
        .warning {
            background-color: #FEF3C7;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
        }
        .warning p {
            color: #92400E;
            margin: 0;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .footer p {
            color: #999;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>mechX</h1>
        </div>

        <h2>Reset Your Password</h2>

        <p>Hi {{ $user->full_name }},</p>

        <p>We received a request to reset your password. Use the code below to reset it:</p>

        <div class="code-box">
            <span class="code">{{ $token }}</span>
        </div>

        <p>Enter this code in the MechX app to create a new password.</p>

        <div class="warning">
            <p><strong>This code expires in 60 minutes.</strong></p>
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>

        <div class="footer">
            <p>MechX - Car Spare Parts Marketplace</p>
            <p>&copy; {{ date('Y') }} MechX. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
