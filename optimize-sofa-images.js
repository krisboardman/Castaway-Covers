const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const MAX_WIDTH = 1920;
const QUALITY = 85;

async function getFileSize(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

async function optimizeImage(inputPath) {
  const fileSize = await getFileSize(inputPath);
  const fileName = path.basename(inputPath);
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

  console.log(`Processing ${fileName} (${fileSizeMB}MB)...`);

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

    // Create temporary optimized version
    const tempPath = inputPath.replace('.jpg', '-optimized.jpg');

    await sharp(inputPath)
      .resize(resizeOptions)
      .jpeg({ quality: QUALITY, progressive: true })
      .toFile(tempPath);

    const optimizedSize = await getFileSize(tempPath);
    const optimizedSizeMB = (optimizedSize / (1024 * 1024)).toFixed(2);

    // Replace original with optimized
    await fs.rename(tempPath, inputPath);

    console.log(`  ✓ Original: ${fileSizeMB}MB → Optimized: ${optimizedSizeMB}MB`);
    console.log(`  ✓ Saved: ${((1 - optimizedSize/fileSize) * 100).toFixed(1)}%\n`);

    return {
      original: fileSize,
      optimized: optimizedSize,
      path: fileName
    };
  } catch (error) {
    console.error(`  ✗ Error processing ${fileName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Optimizing new sofa images...\n');

  const imagesToOptimize = [
    'public/images/Sofas-Loveseats/sofa1.jpg',
    'public/images/Sofas-Loveseats/sofa2.jpg',
    'public/images/Sofas-Loveseats/sofa3.jpg',
    'public/images/Sofas-Loveseats/sofa4.jpg',
    'public/images/Sofas-Loveseats/sofa5.jpg'
  ];

  const results = [];

  for (const imagePath of imagesToOptimize) {
    const fullPath = path.join(__dirname, imagePath);
    const result = await optimizeImage(fullPath);
    if (result) results.push(result);
  }

  const totalOriginal = results.reduce((sum, r) => sum + r.original, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.optimized, 0);

  console.log('\n=== OPTIMIZATION COMPLETE ===');
  console.log(`Total original size: ${(totalOriginal / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`Total optimized size: ${(totalOptimized / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`Total saved: ${((1 - totalOptimized/totalOriginal) * 100).toFixed(1)}%`);
}

main().catch(console.error);
