<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to MechX</title>
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
        .highlight {
            color: #FF5500;
            font-weight: 600;
        }
        .features {
            background-color: #FFF5F0;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
        }
        .features ul {
            margin: 0;
            padding-left: 20px;
        }
        .features li {
            color: #666;
            margin-bottom: 8px;
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

        <h2>Welcome to MechX, {{ $user->full_name }}!</h2>

        <p>Thank you for joining MechX - your trusted marketplace for car spare parts in Albania.</p>

        <p>You've registered as a <span class="highlight">{{ ucfirst($user->user_type) }}</span>.</p>

        <div class="features">
            @if($user->user_type === 'buyer')
            <p><strong>As a buyer, you can:</strong></p>
            <ul>
                <li>Create part requests for your vehicle</li>
                <li>Receive offers from verified sellers</li>
                <li>Compare prices and choose the best deal</li>
                <li>Message sellers directly</li>
                <li>Browse car listings</li>
            </ul>
            @else
            <p><strong>As a seller, you can:</strong></p>
            <ul>
                <li>Browse part requests from buyers</li>
                <li>Submit competitive offers</li>
                <li>Build your reputation with reviews</li>
                <li>List cars for sale</li>
                <li>Connect with buyers directly</li>
            </ul>
            @endif
        </div>

        <p>Get started by opening the MechX app and exploring what's available!</p>

        <div class="footer">
            <p>MechX - Car Spare Parts Marketplace</p>
            <p>&copy; {{ date('Y') }} MechX. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
