<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MechX - Car Spare Parts Marketplace</title>
    <meta name="description" content="MechX connects car owners with verified spare parts sellers in Albania. Find parts, get competitive offers, and complete transactions securely.">

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
        .gradient-dark { background: linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%); }

        .card-shadow {
            box-shadow: 0 4px 20px -5px rgba(255, 85, 0, 0.15),
                        0 2px 8px -2px rgba(0, 0, 0, 0.08);
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }

        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 85, 0, 0.3); }
            50% { box-shadow: 0 0 40px rgba(255, 85, 0, 0.5); }
        }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }

        .phone-frame {
            background: linear-gradient(145deg, #2D2D2D 0%, #1A1A1A 100%);
            border-radius: 40px;
            padding: 12px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .phone-screen {
            background: #0D0D0D;
            border-radius: 32px;
            overflow: hidden;
        }

        html {
            scroll-behavior: smooth;
        }
    </style>
</head>
<body class="bg-dark-900 text-white">

    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-lg border-b border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <a href="#" class="flex items-center space-x-2">
                    <div class="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                        <i class="ph-fill ph-engine text-xl text-white"></i>
                    </div>
                    <span class="text-2xl font-bold">mech<span class="text-brand-500">X</span></span>
                </a>

                <!-- Nav Links (Desktop) -->
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#features" class="text-gray-400 hover:text-white transition">Features</a>
                    <a href="#how-it-works" class="text-gray-400 hover:text-white transition">How It Works</a>
                    <a href="#download" class="gradient-brand text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition">
                        Download App
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <button class="md:hidden text-white" onclick="document.getElementById('mobileMenu').classList.toggle('hidden')">
                    <i class="ph ph-list text-2xl"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobileMenu" class="hidden md:hidden bg-dark-800 border-t border-white/5">
            <div class="px-4 py-4 space-y-3">
                <a href="#features" class="block text-gray-400 hover:text-white transition py-2">Features</a>
                <a href="#how-it-works" class="block text-gray-400 hover:text-white transition py-2">How It Works</a>
                <a href="#download" class="block gradient-brand text-white px-6 py-3 rounded-full font-semibold text-center">
                    Download App
                </a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="min-h-screen pt-16 flex items-center relative overflow-hidden">
        <!-- Background Decorations -->
        <div class="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <!-- Left Content -->
                <div class="text-center lg:text-left">
                    <div class="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-2 mb-6">
                        <span class="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></span>
                        <span class="text-brand-400 text-sm font-medium">Now Available in Albania</span>
                    </div>

                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                        Find Parts.<br>
                        Sell Cars.<br>
                        <span class="text-brand-500">Connect.</span>
                    </h1>

                    <p class="text-xl text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
                        Albania's premier marketplace for car spare parts. Post what you need, get competitive offers from verified sellers, and complete transactions with confidence.
                    </p>

                    <!-- Download Buttons -->
                    <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                        <a href="#" class="transform hover:scale-105 transition-transform">
                            <img src="{{ asset('images/app-store-badge.svg') }}" alt="Download on App Store" class="h-14">
                        </a>
                        <a href="#" class="transform hover:scale-105 transition-transform">
                            <img src="{{ asset('images/play-store-badge.svg') }}" alt="Get it on Google Play" class="h-14">
                        </a>
                    </div>

                    <!-- Stats -->
                    <div class="flex items-center justify-center lg:justify-start gap-8 text-center">
                        <div>
                            <div class="text-2xl font-bold text-brand-500">1000+</div>
                            <div class="text-sm text-gray-500">Active Users</div>
                        </div>
                        <div class="w-px h-10 bg-white/10"></div>
                        <div>
                            <div class="text-2xl font-bold text-brand-500">500+</div>
                            <div class="text-sm text-gray-500">Verified Sellers</div>
                        </div>
                        <div class="w-px h-10 bg-white/10"></div>
                        <div>
                            <div class="text-2xl font-bold text-brand-500">4.8</div>
                            <div class="text-sm text-gray-500">App Rating</div>
                        </div>
                    </div>
                </div>

                <!-- Right Content - Phone Mockup -->
                <div class="flex justify-center lg:justify-end">
                    <div class="phone-frame animate-float w-72">
                        <div class="phone-screen aspect-[9/19] flex items-center justify-center">
                            <!-- Placeholder for app screenshot -->
                            <div class="w-full h-full bg-gradient-to-b from-dark-800 to-dark-900 flex flex-col items-center justify-center p-6">
                                <div class="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mb-4 animate-pulse-glow">
                                    <i class="ph-fill ph-engine text-3xl text-white"></i>
                                </div>
                                <span class="text-xl font-bold">mech<span class="text-brand-500">X</span></span>
                                <span class="text-gray-500 text-sm mt-2">App Screenshot</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-dark-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl sm:text-4xl font-bold mb-4">Everything You Need</h2>
                <p class="text-gray-400 text-lg max-w-2xl mx-auto">
                    Whether you're looking for parts or selling them, MechX has the tools to make it easy.
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Feature 1 -->
                <div class="bg-dark-700 rounded-3xl p-6 hover:bg-dark-700/80 transition card-shadow">
                    <div class="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mb-4">
                        <i class="ph-fill ph-magnifying-glass text-2xl text-white"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Request Parts</h3>
                    <p class="text-gray-400">
                        Post exactly what you need - part name, car model, year. Sellers come to you with offers.
                    </p>
                </div>

                <!-- Feature 2 -->
                <div class="bg-dark-700 rounded-3xl p-6 hover:bg-dark-700/80 transition card-shadow">
                    <div class="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mb-4">
                        <i class="ph-fill ph-tag text-2xl text-white"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Get Offers</h3>
                    <p class="text-gray-400">
                        Receive multiple competitive offers from verified sellers. Compare prices and conditions.
                    </p>
                </div>

                <!-- Feature 3 -->
                <div class="bg-dark-700 rounded-3xl p-6 hover:bg-dark-700/80 transition card-shadow">
                    <div class="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mb-4">
                        <i class="ph-fill ph-star text-2xl text-white"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Compare & Choose</h3>
                    <p class="text-gray-400">
                        Review seller ratings, compare prices, and choose the best offer for your needs.
                    </p>
                </div>

                <!-- Feature 4 -->
                <div class="bg-dark-700 rounded-3xl p-6 hover:bg-dark-700/80 transition card-shadow">
                    <div class="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mb-4">
                        <i class="ph-fill ph-chat-circle text-2xl text-white"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Secure Messaging</h3>
                    <p class="text-gray-400">
                        Chat directly with sellers to clarify details and finalize your transaction safely.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
                <p class="text-gray-400 text-lg max-w-2xl mx-auto">
                    Simple steps to get the parts you need or grow your sales.
                </p>
            </div>

            <div class="grid lg:grid-cols-2 gap-16">
                <!-- For Buyers -->
                <div>
                    <div class="flex items-center space-x-3 mb-8">
                        <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <i class="ph-fill ph-shopping-cart text-green-500"></i>
                        </div>
                        <h3 class="text-2xl font-bold">For Buyers</h3>
                    </div>

                    <div class="space-y-6">
                        <div class="flex items-start space-x-4">
                            <div class="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-sm font-bold shrink-0">1</div>
                            <div>
                                <h4 class="font-semibold mb-1">Post Your Request</h4>
                                <p class="text-gray-400">Describe the part you need with car details and photos.</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4">
                            <div class="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-sm font-bold shrink-0">2</div>
                            <div>
                                <h4 class="font-semibold mb-1">Receive Offers</h4>
                                <p class="text-gray-400">Get competitive offers from multiple verified sellers.</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4">
                            <div class="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-sm font-bold shrink-0">3</div>
                            <div>
                                <h4 class="font-semibold mb-1">Compare & Choose</h4>
                                <p class="text-gray-400">Review ratings, prices, and select the best offer.</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4">
                            <div class="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-sm font-bold shrink-0">4</div>
                            <div>
                                <h4 class="font-semibold mb-1">Complete Transaction</h4>
                                <p class="text-gray-400">Finalize the deal and leave a review for the seller.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- For Sellers -->
                <div>
                    <div class="flex items-center space-x-3 mb-8">
                        <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <i class="ph-fill ph-storefront text-blue-500"></i>
                        </div>
                        <h3 class="text-2xl font-bold">For Sellers</h3>
                    </div>

                    <div class="space-y-6">
                        <div class="flex items-start space-x-4">
                            <div class="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-sm font-bold shrink-0">1</div>
                            <div>
                                <h4 class="font-semibold mb-1">Browse Requests</h4>
                                <p class="text-gray-400">See what parts buyers are looking for in real-time.</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4">
                            <div class="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-sm font-bold shrink-0">2</div>
                            <div>
                                <h4 class="font-semibold mb-1">Submit Offers</h4>
                                <p class="text-gray-400">Send competitive offers with price and delivery time.</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4">
                            <div class="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-sm font-bold shrink-0">3</div>
                            <div>
                                <h4 class="font-semibold mb-1">Get Accepted</h4>
                                <p class="text-gray-400">When a buyer accepts, finalize the transaction details.</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4">
                            <div class="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-sm font-bold shrink-0">4</div>
                            <div>
                                <h4 class="font-semibold mb-1">Grow Your Business</h4>
                                <p class="text-gray-400">Build your reputation with positive reviews and ratings.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Screenshots Section -->
    <section class="py-24 bg-dark-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl sm:text-4xl font-bold mb-4">See It In Action</h2>
                <p class="text-gray-400 text-lg max-w-2xl mx-auto">
                    A beautiful, intuitive interface designed for the best user experience.
                </p>
            </div>

            <div class="flex flex-wrap justify-center gap-6">
                <!-- Screenshot 1 -->
                <div class="phone-frame w-56">
                    <div class="phone-screen aspect-[9/19] flex items-center justify-center">
                        <div class="w-full h-full bg-gradient-to-b from-dark-800 to-dark-900 flex flex-col items-center justify-center p-4">
                            <i class="ph-fill ph-house text-4xl text-brand-500 mb-2"></i>
                            <span class="text-sm text-gray-400">Home Screen</span>
                        </div>
                    </div>
                </div>

                <!-- Screenshot 2 -->
                <div class="phone-frame w-56 hidden sm:block">
                    <div class="phone-screen aspect-[9/19] flex items-center justify-center">
                        <div class="w-full h-full bg-gradient-to-b from-dark-800 to-dark-900 flex flex-col items-center justify-center p-4">
                            <i class="ph-fill ph-list-bullets text-4xl text-brand-500 mb-2"></i>
                            <span class="text-sm text-gray-400">Browse Requests</span>
                        </div>
                    </div>
                </div>

                <!-- Screenshot 3 -->
                <div class="phone-frame w-56 hidden md:block">
                    <div class="phone-screen aspect-[9/19] flex items-center justify-center">
                        <div class="w-full h-full bg-gradient-to-b from-dark-800 to-dark-900 flex flex-col items-center justify-center p-4">
                            <i class="ph-fill ph-chat-circle text-4xl text-brand-500 mb-2"></i>
                            <span class="text-sm text-gray-400">Messaging</span>
                        </div>
                    </div>
                </div>

                <!-- Screenshot 4 -->
                <div class="phone-frame w-56 hidden lg:block">
                    <div class="phone-screen aspect-[9/19] flex items-center justify-center">
                        <div class="w-full h-full bg-gradient-to-b from-dark-800 to-dark-900 flex flex-col items-center justify-center p-4">
                            <i class="ph-fill ph-user-circle text-4xl text-brand-500 mb-2"></i>
                            <span class="text-sm text-gray-400">Profile</span>
                        </div>
                    </div>
                </div>
            </div>

            <p class="text-center text-gray-500 text-sm mt-8">
                * Screenshots are placeholders. Replace with actual app screenshots.
            </p>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl sm:text-4xl font-bold mb-4">What Users Say</h2>
                <p class="text-gray-400 text-lg max-w-2xl mx-auto">
                    Join thousands of satisfied buyers and sellers in Albania.
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-6">
                <!-- Testimonial 1 -->
                <div class="bg-dark-800 rounded-3xl p-6 card-shadow">
                    <div class="flex items-center space-x-1 mb-4">
                        <i class="ph-fill ph-star text-yellow-500"></i>
                        <i class="ph-fill ph-star text-yellow-500"></i>
                        <i class="ph-fill ph-star text-yellow-500"></i>
                        <i class="ph-fill ph-star text-yellow-500"></i>
                        <i class="ph-fill ph-star text-yellow-500"></i>
                    </div>
                    <p class="text-gray-300 mb-6">
                        "Found a rare part for my BMW in just 2 hours! The sellers were professional and the prices were competitive. Highly recommend MechX."
                    </p>
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                            <span class="text-brand-500 font-semibold">A</span>
                        </div>
                        <div>
                            <div class="font-semibold">Arben K.</div>
                            <div class="text-sm text-gray-500">Car Owner, Tirana</div>
                        </div>
                    </div>
                </div>

                <!-- Testimonial 2 -->
                <div class="bg-dark-800 rounded-3xl p-6 card-shadow">
                    <div class="flex items-center space-x-1 mb-4">
                        <i class="ph-fill ph-star text-yellow-500"></i>
                        <i class="ph-fill ph-star text-yellow-500"></i>
                        <i class="ph-fill ph-star text-yellow-500"></i>
                        <i class="ph-fill ph-star text-yellow-500"></i>
                        <i class="ph-fill ph-star text-yellow-500"></i>
                    </div>
                    <p class="text-gray-300 mb-6">
                        "As a seller, MechX has transformed my business. I get direct access to buyers who need exactly what I have. Sales have increased 40%!"
                    </p>
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                            <span class="text-brand-500 font-semibold">B</span>
                        </div>
                        <div>
                            <div class="font-semibold">Besnik M.</div>
                            <div class="text-sm text-gray-500">Auto Parts Dealer, Durres</div>
                        </div>
                    </div>
                </div>

                <!-- Testimonial 3 -->
                <div class="bg-dark-800 rounded-3xl p-6 card-shadow">
                    <div class="flex items-center space-x-1 mb-4">
                        <i class="ph-fill ph-star text-yellow-500"></i>
                        <i class="ph-fill ph-star text-yellow-500"></i>
                        <i class="ph-fill ph-star text-yellow-500"></i>
                        <i class="ph-fill ph-star text-yellow-500"></i>
                        <i class="ph-fill ph-star text-yellow-500"></i>
                    </div>
                    <p class="text-gray-300 mb-6">
                        "The messaging feature makes communication so easy. I can negotiate directly with sellers and get exactly what my car needs."
                    </p>
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                            <span class="text-brand-500 font-semibold">E</span>
                        </div>
                        <div>
                            <div class="font-semibold">Elira S.</div>
                            <div class="text-sm text-gray-500">Car Enthusiast, Vlora</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Download CTA Section -->
    <section id="download" class="py-24 bg-dark-800 relative overflow-hidden">
        <!-- Background Decorations -->
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-500/5 rounded-full blur-3xl"></div>

        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div class="w-20 h-20 rounded-3xl gradient-brand flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
                <i class="ph-fill ph-engine text-4xl text-white"></i>
            </div>

            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Ready to Find Your Parts?
            </h2>

            <p class="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Download MechX today and join Albania's fastest-growing car parts marketplace. It's free to get started!
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#" class="transform hover:scale-105 transition-transform">
                    <img src="{{ asset('images/app-store-badge.svg') }}" alt="Download on App Store" class="h-16">
                </a>
                <a href="#" class="transform hover:scale-105 transition-transform">
                    <img src="{{ asset('images/play-store-badge.svg') }}" alt="Get it on Google Play" class="h-16">
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 border-t border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8 mb-8">
                <!-- Brand -->
                <div class="md:col-span-2">
                    <a href="#" class="flex items-center space-x-2 mb-4">
                        <div class="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                            <i class="ph-fill ph-engine text-xl text-white"></i>
                        </div>
                        <span class="text-2xl font-bold">mech<span class="text-brand-500">X</span></span>
                    </a>
                    <p class="text-gray-400 max-w-sm">
                        Albania's premier marketplace for car spare parts. Connecting car owners with verified sellers since 2024.
                    </p>
                </div>

                <!-- Links -->
                <div>
                    <h4 class="font-semibold mb-4">Legal</h4>
                    <ul class="space-y-2">
                        <li><a href="{{ url('/privacy') }}" class="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="{{ url('/terms') }}" class="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                    </ul>
                </div>

                <!-- Contact -->
                <div>
                    <h4 class="font-semibold mb-4">Contact</h4>
                    <ul class="space-y-2">
                        <li><a href="mailto:support@mechx.al" class="text-gray-400 hover:text-white transition">support@mechx.al</a></li>
                        <li class="flex items-center space-x-3 pt-2">
                            <a href="#" class="text-gray-400 hover:text-brand-500 transition">
                                <i class="ph-fill ph-facebook-logo text-xl"></i>
                            </a>
                            <a href="#" class="text-gray-400 hover:text-brand-500 transition">
                                <i class="ph-fill ph-instagram-logo text-xl"></i>
                            </a>
                            <a href="#" class="text-gray-400 hover:text-brand-500 transition">
                                <i class="ph-fill ph-twitter-logo text-xl"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="border-t border-white/5 pt-8 text-center text-gray-500 text-sm">
                <p>&copy; {{ date('Y') }} MechX. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>