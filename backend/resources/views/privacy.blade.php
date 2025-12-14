<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - MechX</title>
    <meta name="description" content="MechX Privacy Policy - Learn how we collect, use, and protect your personal information.">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Google Fonts - DM Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">

    <!-- Phosphor Icons -->
    <script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'brand': {
                            50: '#FFF5F0',
                            100: '#FFEBE0',
                            200: '#FFD4BD',
                            300: '#FFBA94',
                            400: '#FF8C42',
                            500: '#FF5500',
                            600: '#E64D00',
                            700: '#CC4400',
                            800: '#993300',
                            900: '#662200',
                        },
                        'dark': {
                            700: '#2D2D2D',
                            800: '#1A1A1A',
                            900: '#0D0D0D',
                        }
                    },
                    fontFamily: {
                        'sans': ['"DM Sans"', 'system-ui', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <style>
        * { font-family: 'DM Sans', system-ui, sans-serif; }
        .gradient-brand { background: linear-gradient(135deg, #FF5500 0%, #FF8C42 100%); }
        html { scroll-behavior: smooth; }
    </style>
</head>
<body class="bg-dark-900 text-white">

    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-lg border-b border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <a href="{{ url('/') }}" class="flex items-center space-x-2">
                    <div class="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                        <i class="ph-fill ph-engine text-xl text-white"></i>
                    </div>
                    <span class="text-2xl font-bold">mech<span class="text-brand-500">X</span></span>
                </a>

                <!-- Back to Home -->
                <a href="{{ url('/') }}" class="text-gray-400 hover:text-white transition flex items-center space-x-2">
                    <i class="ph ph-arrow-left"></i>
                    <span>Back to Home</span>
                </a>
            </div>
        </div>
    </nav>

    <!-- Content -->
    <main class="pt-24 pb-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-12">
                <h1 class="text-4xl font-bold mb-4">Privacy Policy</h1>
                <p class="text-gray-400">Last updated: {{ date('F d, Y') }}</p>
            </div>

            <!-- Content -->
            <div class="prose prose-invert max-w-none space-y-8">
                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">1. Introduction</h2>
                    <p class="text-gray-300 leading-relaxed">
                        Welcome to MechX ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
                    </p>
                    <p class="text-gray-300 leading-relaxed mt-4">
                        Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">2. Information We Collect</h2>

                    <h3 class="text-lg font-semibold mb-3 text-white">Personal Information</h3>
                    <p class="text-gray-300 leading-relaxed mb-4">
                        We collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, or otherwise contact us. This includes:
                    </p>
                    <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
                        <li>Name and contact information (email address, phone number)</li>
                        <li>Account credentials (username and password)</li>
                        <li>Profile information (profile photo, business name for sellers)</li>
                        <li>Transaction data (part requests, offers, purchases)</li>
                        <li>Communication data (messages between users)</li>
                    </ul>

                    <h3 class="text-lg font-semibold mb-3 mt-6 text-white">Automatically Collected Information</h3>
                    <p class="text-gray-300 leading-relaxed mb-4">
                        When you use our application, we automatically collect certain information, including:
                    </p>
                    <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
                        <li>Device information (device type, operating system, unique device identifiers)</li>
                        <li>Log and usage data (access times, pages viewed, app features used)</li>
                        <li>Location information (with your consent)</li>
                        <li>Push notification tokens (for sending notifications)</li>
                    </ul>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">3. How We Use Your Information</h2>
                    <p class="text-gray-300 leading-relaxed mb-4">
                        We use the information we collect for various purposes, including:
                    </p>
                    <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
                        <li>To provide and maintain our service</li>
                        <li>To facilitate transactions between buyers and sellers</li>
                        <li>To send you notifications about offers, messages, and updates</li>
                        <li>To improve our application and user experience</li>
                        <li>To communicate with you about your account or transactions</li>
                        <li>To detect and prevent fraud or abuse</li>
                        <li>To comply with legal obligations</li>
                    </ul>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">4. Sharing Your Information</h2>
                    <p class="text-gray-300 leading-relaxed mb-4">
                        We may share your information in the following situations:
                    </p>
                    <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
                        <li><strong>With other users:</strong> When you create a part request or submit an offer, relevant information is shared with other users to facilitate transactions.</li>
                        <li><strong>With service providers:</strong> We may share your information with third-party vendors who provide services on our behalf (hosting, analytics, customer support).</li>
                        <li><strong>For legal purposes:</strong> We may disclose your information if required by law or to protect our rights, privacy, safety, or property.</li>
                        <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred.</li>
                    </ul>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">5. Data Security</h2>
                    <p class="text-gray-300 leading-relaxed">
                        We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">6. Your Rights</h2>
                    <p class="text-gray-300 leading-relaxed mb-4">
                        Depending on your location, you may have certain rights regarding your personal information:
                    </p>
                    <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
                        <li>Access and receive a copy of your personal data</li>
                        <li>Rectify or update your personal information</li>
                        <li>Request deletion of your personal data</li>
                        <li>Object to or restrict processing of your data</li>
                        <li>Data portability</li>
                        <li>Withdraw consent at any time</li>
                    </ul>
                    <p class="text-gray-300 leading-relaxed mt-4">
                        To exercise these rights, please contact us using the information provided below.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">7. Data Retention</h2>
                    <p class="text-gray-300 leading-relaxed">
                        We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. When you delete your account, we will delete or anonymize your information within 30 days, except where we need to retain certain information for legal or legitimate business purposes.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">8. Children's Privacy</h2>
                    <p class="text-gray-300 leading-relaxed">
                        Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">9. Changes to This Policy</h2>
                    <p class="text-gray-300 leading-relaxed">
                        We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date. You are advised to review this privacy policy periodically for any changes.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">10. Contact Us</h2>
                    <p class="text-gray-300 leading-relaxed">
                        If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <ul class="text-gray-300 mt-4 space-y-2">
                        <li><strong>Email:</strong> <a href="mailto:privacy@mechx.al" class="text-brand-500 hover:text-brand-400">privacy@mechx.al</a></li>
                        <li><strong>Address:</strong> Tirana, Albania</li>
                    </ul>
                </section>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="py-8 border-t border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                <a href="{{ url('/') }}" class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                        <i class="ph-fill ph-engine text-sm text-white"></i>
                    </div>
                    <span class="text-lg font-bold">mech<span class="text-brand-500">X</span></span>
                </a>
                <div class="flex items-center space-x-6 text-sm text-gray-400">
                    <a href="{{ url('/privacy') }}" class="text-white">Privacy Policy</a>
                    <a href="{{ url('/terms') }}" class="hover:text-white transition">Terms of Service</a>
                </div>
                <p class="text-gray-500 text-sm">&copy; {{ date('Y') }} MechX. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>