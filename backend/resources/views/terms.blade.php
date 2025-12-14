<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service - MechX</title>
    <meta name="description" content="MechX Terms of Service - Read our terms and conditions for using the MechX platform.">

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
                <h1 class="text-4xl font-bold mb-4">Terms of Service</h1>
                <p class="text-gray-400">Last updated: {{ date('F d, Y') }}</p>
            </div>

            <!-- Content -->
            <div class="prose prose-invert max-w-none space-y-8">
                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">1. Acceptance of Terms</h2>
                    <p class="text-gray-300 leading-relaxed">
                        By accessing or using the MechX mobile application and services ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
                    </p>
                    <p class="text-gray-300 leading-relaxed mt-4">
                        We reserve the right to modify these Terms at any time. Your continued use of the Service after any modifications indicates your acceptance of the updated Terms.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">2. Description of Service</h2>
                    <p class="text-gray-300 leading-relaxed">
                        MechX is a mobile marketplace platform that connects car owners seeking spare parts ("Buyers") with verified sellers who can fulfill those requests ("Sellers"). Our Service facilitates:
                    </p>
                    <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4 mt-4">
                        <li>Creation and management of part requests by Buyers</li>
                        <li>Submission of offers by Sellers in response to requests</li>
                        <li>Communication between Buyers and Sellers</li>
                        <li>Review and rating system for completed transactions</li>
                        <li>Car listings for sale</li>
                    </ul>
                    <p class="text-gray-300 leading-relaxed mt-4">
                        MechX acts as an intermediary platform and is not a party to any transaction between Buyers and Sellers.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">3. User Accounts</h2>

                    <h3 class="text-lg font-semibold mb-3 text-white">Registration</h3>
                    <p class="text-gray-300 leading-relaxed mb-4">
                        To use certain features of our Service, you must register for an account. You agree to:
                    </p>
                    <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
                        <li>Provide accurate, current, and complete information during registration</li>
                        <li>Maintain and promptly update your account information</li>
                        <li>Maintain the security of your password and account</li>
                        <li>Accept responsibility for all activities under your account</li>
                        <li>Notify us immediately of any unauthorized use of your account</li>
                    </ul>

                    <h3 class="text-lg font-semibold mb-3 mt-6 text-white">Account Types</h3>
                    <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
                        <li><strong>Buyer Account:</strong> For users seeking to purchase car spare parts</li>
                        <li><strong>Seller Account:</strong> For businesses or individuals selling car spare parts (requires additional business information)</li>
                    </ul>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">4. User Conduct</h2>
                    <p class="text-gray-300 leading-relaxed mb-4">
                        You agree not to:
                    </p>
                    <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
                        <li>Use the Service for any illegal purpose or in violation of any laws</li>
                        <li>Post false, inaccurate, or misleading content</li>
                        <li>Harass, abuse, or harm other users</li>
                        <li>Spam or send unsolicited communications</li>
                        <li>Attempt to circumvent security features of the Service</li>
                        <li>Use automated systems or software to extract data from the Service</li>
                        <li>Impersonate any person or entity</li>
                        <li>Sell counterfeit, stolen, or prohibited items</li>
                        <li>Manipulate ratings or reviews</li>
                        <li>Interfere with or disrupt the Service</li>
                    </ul>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">5. Transactions</h2>

                    <h3 class="text-lg font-semibold mb-3 text-white">Part Requests and Offers</h3>
                    <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
                        <li>Buyers may post requests specifying the parts they need</li>
                        <li>Sellers may submit offers in response to requests</li>
                        <li>Accepting an offer creates a binding agreement between Buyer and Seller</li>
                        <li>All prices are displayed in Albanian Lek (L)</li>
                    </ul>

                    <h3 class="text-lg font-semibold mb-3 mt-6 text-white">Transaction Completion</h3>
                    <p class="text-gray-300 leading-relaxed">
                        MechX does not process payments directly. Buyers and Sellers are responsible for arranging payment and delivery between themselves. MechX is not responsible for the quality, safety, or legality of items listed, the accuracy of listings, or the ability of Sellers to complete sales.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">6. Reviews and Ratings</h2>
                    <p class="text-gray-300 leading-relaxed mb-4">
                        After completing a transaction, Buyers may leave reviews and ratings for Sellers. You agree that:
                    </p>
                    <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4">
                        <li>Reviews must be honest and based on actual experiences</li>
                        <li>Reviews must not contain defamatory, obscene, or illegal content</li>
                        <li>You will not offer or accept compensation for reviews</li>
                        <li>MechX may remove reviews that violate these Terms</li>
                    </ul>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">7. Intellectual Property</h2>
                    <p class="text-gray-300 leading-relaxed">
                        The Service and its original content, features, and functionality are owned by MechX and are protected by international copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our Service without our express written consent.
                    </p>
                    <p class="text-gray-300 leading-relaxed mt-4">
                        By posting content on our Service, you grant MechX a non-exclusive, worldwide, royalty-free license to use, display, and distribute such content in connection with the Service.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">8. Disclaimer of Warranties</h2>
                    <p class="text-gray-300 leading-relaxed">
                        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. MECHX DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                    </p>
                    <p class="text-gray-300 leading-relaxed mt-4">
                        MECHX DOES NOT GUARANTEE THE QUALITY, SAFETY, OR LEGALITY OF ITEMS LISTED, THE TRUTH OR ACCURACY OF LISTINGS, OR THE ABILITY OF SELLERS TO SELL ITEMS OR BUYERS TO PAY FOR ITEMS.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">9. Limitation of Liability</h2>
                    <p class="text-gray-300 leading-relaxed">
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, MECHX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
                    </p>
                    <ul class="list-disc list-inside text-gray-300 space-y-2 ml-4 mt-4">
                        <li>Your use or inability to use the Service</li>
                        <li>Any conduct or content of any third party on the Service</li>
                        <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                        <li>Any transaction between you and any other user</li>
                    </ul>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">10. Indemnification</h2>
                    <p class="text-gray-300 leading-relaxed">
                        You agree to indemnify, defend, and hold harmless MechX, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorney's fees, arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your violation of any rights of another.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">11. Termination</h2>
                    <p class="text-gray-300 leading-relaxed">
                        We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
                    </p>
                    <p class="text-gray-300 leading-relaxed mt-4">
                        You may delete your account at any time through the app settings. Account deletion will result in the permanent loss of your data, subject to our data retention policies.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">12. Dispute Resolution</h2>
                    <p class="text-gray-300 leading-relaxed">
                        Any disputes arising out of or relating to these Terms or the Service shall be resolved through good faith negotiation. If negotiation fails, disputes shall be settled by arbitration in accordance with the laws of Albania.
                    </p>
                    <p class="text-gray-300 leading-relaxed mt-4">
                        For disputes between Buyers and Sellers, MechX may, at its discretion, provide assistance in resolving the dispute but is not obligated to do so.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">13. Governing Law</h2>
                    <p class="text-gray-300 leading-relaxed">
                        These Terms shall be governed by and construed in accordance with the laws of Albania, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be brought exclusively in the courts located in Tirana, Albania.
                    </p>
                </section>

                <section class="bg-dark-800 rounded-2xl p-6 sm:p-8">
                    <h2 class="text-2xl font-semibold mb-4 text-brand-500">14. Contact Us</h2>
                    <p class="text-gray-300 leading-relaxed">
                        If you have any questions about these Terms of Service, please contact us:
                    </p>
                    <ul class="text-gray-300 mt-4 space-y-2">
                        <li><strong>Email:</strong> <a href="mailto:legal@mechx.al" class="text-brand-500 hover:text-brand-400">legal@mechx.al</a></li>
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
                    <a href="{{ url('/privacy') }}" class="hover:text-white transition">Privacy Policy</a>
                    <a href="{{ url('/terms') }}" class="text-white">Terms of Service</a>
                </div>
                <p class="text-gray-500 text-sm">&copy; {{ date('Y') }} MechX. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>