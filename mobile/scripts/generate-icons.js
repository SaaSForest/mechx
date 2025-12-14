/**
 * App Icon Generator for MechX
 *
 * This script converts the SVG logo to PNG icons for App Store and Play Store.
 *
 * Requirements:
 * - npm install sharp
 *
 * Usage:
 * - node scripts/generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const SVG_PATH = path.join(ASSETS_DIR, 'mechx-logo.svg');

// Icon sizes needed
const ICON_SIZES = {
  // iOS App Store
  'icon.png': 1024,           // Main app icon (Expo uses this)
  'icon-ios.png': 1024,       // iOS App Store (1024x1024)

  // Android Play Store
  'icon-android.png': 512,    // Play Store icon (512x512)
  'adaptive-icon.png': 1024,  // Android adaptive icon foreground

  // Splash/Favicon
  'splash-icon.png': 1024,    // Splash screen icon
  'favicon.png': 48,          // Web favicon
};

async function generateIcons() {
  console.log('🎨 MechX Icon Generator\n');

  // Check if SVG exists
  if (!fs.existsSync(SVG_PATH)) {
    console.error('❌ SVG file not found:', SVG_PATH);
    console.log('\nPlease ensure mechx-logo.svg exists in the assets folder.');
    process.exit(1);
  }

  console.log('📁 Source:', SVG_PATH);
  console.log('📁 Output:', ASSETS_DIR);
  console.log('');

  const svgBuffer = fs.readFileSync(SVG_PATH);

  for (const [filename, size] of Object.entries(ICON_SIZES)) {
    const outputPath = path.join(ASSETS_DIR, filename);

    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated: ${filename} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Failed: ${filename} - ${error.message}`);
    }
  }

  console.log('\n🎉 Icon generation complete!');
  console.log('\nNext steps:');
  console.log('1. Review the generated icons in assets/');
  console.log('2. For iOS: Upload icon-ios.png to App Store Connect');
  console.log('3. For Android: Upload icon-android.png to Play Console');
  console.log('4. Run "npx expo prebuild" to apply icons to native projects');
}

generateIcons().catch(console.error);
