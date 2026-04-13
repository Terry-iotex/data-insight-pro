const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Function to create a simple gradient image as placeholder
async function createPlaceholderScreenshot(name, title, color1, color2) {
  const width = 1280;
  const height = 800;

  // Create an SVG with the content
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a"/>
          <stop offset="100%" style="stop-color:#1e293b"/>
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${color1}"/>
          <stop offset="100%" style="stop-color:${color2}"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bg)"/>

      <!-- Title -->
      <text x="50%" y="45%" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ffffff">${title}</text>
      <text x="50%" y="52%" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#94a3b8">DeciFlow - AI Data Analysis Tool</text>

      <!-- Decorative Element -->
      <rect x="35%" y="60%" width="30%" height="8" rx="4" fill="url(#accent)"/>
    </svg>
  `;

  const outputPath = path.join(__dirname, '../screenshots', `${name}.png`);

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  console.log(`Generated: ${name}.png`);
}

async function generateAllScreenshots() {
  const screenshots = [
    { name: 'dashboard', title: '📊 仪表盘', color1: '#6366f1', color2: '#8b5cf6' },
    { name: 'analysis', title: '🤖 AI 智能分析', color1: '#06b6d4', color2: '#3b82f6' },
    { name: 'charts', title: '📈 数据可视化', color1: '#10b981', color2: '#06b6d4' },
  ];

  for (const shot of screenshots) {
    await createPlaceholderScreenshot(shot.name, shot.title, shot.color1, shot.color2);
  }

  console.log('✅ All screenshots generated!');
  console.log('💡 Tip: Replace these with actual app screenshots for better presentation');
}

generateAllScreenshots().catch(console.error);
