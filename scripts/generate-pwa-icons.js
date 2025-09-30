const fs = require('fs');
const path = require('path');

// Create a simple SVG icon generator for PWA icons
function createSVGIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#000000"/>
  <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" rx="${size * 0.1}" fill="#ffffff"/>
  <circle cx="${size * 0.3}" cy="${size * 0.3}" r="${size * 0.1}" fill="#000000"/>
  <circle cx="${size * 0.7}" cy="${size * 0.3}" r="${size * 0.1}" fill="#000000"/>
  <path d="M ${size * 0.2} ${size * 0.6} Q ${size * 0.5} ${size * 0.8} ${size * 0.8} ${size * 0.6}" stroke="#000000" stroke-width="${size * 0.05}" fill="none"/>
</svg>`;
}

// Icon sizes for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons for each size
iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filePath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated icon-${size}x${size}.svg`);
});

// Create a simple PNG placeholder (this would normally be done with a proper image processing library)
const createPNGPlaceholder = (size) => {
  // This is a placeholder - in a real implementation, you'd use a library like sharp or canvas
  // to convert the SVG to PNG or create proper PNG icons
  console.log(`Note: PNG icon-${size}x${size}.png should be created from the SVG or a proper design tool`);
};

iconSizes.forEach(size => {
  createPNGPlaceholder(size);
});

console.log('\nPWA icons generated successfully!');
console.log('Note: For production, replace the generated SVG files with proper PNG icons');
console.log('You can use tools like:');
console.log('- https://realfavicongenerator.net/');
console.log('- https://www.pwabuilder.com/imageGenerator');
console.log('- Or design tools like Figma, Sketch, etc.');
