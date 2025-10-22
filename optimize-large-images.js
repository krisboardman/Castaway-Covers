const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const MAX_WIDTH = 1920;
const QUALITY = 85;

async function optimizeImage(inputPath) {
  const stats = await fs.stat(inputPath);
  const originalSize = stats.size;
  const fileName = path.basename(inputPath);
  const fileSizeMB = (originalSize / (1024 * 1024)).toFixed(2);
  const fileSizeKB = (originalSize / 1024).toFixed(2);

  console.log(`Processing ${fileName} (${fileSizeKB}KB)...`);

  try {
    const metadata = await sharp(inputPath).metadata();

    let resizeOptions = {};
    if (metadata.width > MAX_WIDTH) {
      resizeOptions = {
        width: MAX_WIDTH,
        withoutEnlargement: true,
        fit: 'inside'
      };
    }

    const tempPath = inputPath.replace(/\.(jpg|jpeg)$/i, '-optimized.jpg');

    await sharp(inputPath)
      .resize(resizeOptions)
      .jpeg({ quality: QUALITY, progressive: true })
      .toFile(tempPath);

    const optimizedStats = await fs.stat(tempPath);
    const optimizedSize = optimizedStats.size;
    const optimizedKB = (optimizedSize / 1024).toFixed(2);

    // Only replace if it's actually smaller
    if (optimizedSize < originalSize) {
      await fs.rename(tempPath, inputPath);
      console.log(`  ✓ ${fileSizeKB}KB → ${optimizedKB}KB (saved ${((1 - optimizedSize/originalSize) * 100).toFixed(1)}%)`);
      return { original: originalSize, optimized: optimizedSize, saved: true };
    } else {
      await fs.unlink(tempPath);
      console.log(`  ✗ Skip (optimized would be larger)`);
      return { original: originalSize, optimized: originalSize, saved: false };
    }
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('Optimizing large images (>500KB)...\n');

  const imagesToOptimize = [
    'public/images/Options/snap-strap.jpg',
    'public/images/Sofas-Loveseats/sofa4.jpg',
    'public/images/gallery/Gallery4.jpg',
    'public/images/Sofas-Loveseats/sofa5.jpg',
    'public/images/Sofas-Loveseats/sofa1.jpg',
    'public/images/gallery/Gallery5.jpg',
    'public/images/Tables/table5.jpg',
    'public/images/Tables/table4.jpg',
    'public/images/hero/hero4.jpg',
    'public/images/gallery/Gallery1.jpg',
    'public/images/Chairs-Recliners/chair5.jpg',
    'public/images/gallery/Gallery2.jpg'
  ];

  const results = [];

  for (const imagePath of imagesToOptimize) {
    const fullPath = path.join(__dirname, imagePath);
    const result = await optimizeImage(fullPath);
    if (result) results.push(result);
  }

  const savedResults = results.filter(r => r.saved);
  const totalOriginal = savedResults.reduce((sum, r) => sum + r.original, 0);
  const totalOptimized = savedResults.reduce((sum, r) => sum + r.optimized, 0);

  console.log('\n=== OPTIMIZATION COMPLETE ===');
  console.log(`Images optimized: ${savedResults.length}/${results.length}`);
  console.log(`Total saved: ${((totalOriginal - totalOptimized) / 1024).toFixed(2)}KB`);
  console.log(`Reduction: ${((1 - totalOptimized/totalOriginal) * 100).toFixed(1)}%`);
}

main().catch(console.error);
