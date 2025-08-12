const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const MAX_WIDTH = 1920; // Max width for images
const MAX_FILE_SIZE = 500 * 1024; // 500KB target
const QUALITY = 85; // JPEG/WebP quality (1-100)

async function getFileSize(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

async function optimizeImage(inputPath, outputPath) {
  const fileSize = await getFileSize(inputPath);
  const fileName = path.basename(inputPath);
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
  
  console.log(`Processing ${fileName} (${fileSizeMB}MB)...`);
  
  try {
    // Read image metadata
    const metadata = await sharp(inputPath).metadata();
    
    // Calculate new dimensions if needed
    let resizeOptions = {};
    if (metadata.width > MAX_WIDTH) {
      resizeOptions = {
        width: MAX_WIDTH,
        withoutEnlargement: true,
        fit: 'inside'
      };
    }
    
    // Create WebP version
    const webpPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    await sharp(inputPath)
      .resize(resizeOptions)
      .webp({ quality: QUALITY })
      .toFile(webpPath);
    
    const webpSize = await getFileSize(webpPath);
    const webpSizeMB = (webpSize / (1024 * 1024)).toFixed(2);
    
    // Also create optimized JPEG/PNG as fallback
    if (inputPath.match(/\.png$/i)) {
      // Keep PNG for images that need transparency
      await sharp(inputPath)
        .resize(resizeOptions)
        .png({ quality: QUALITY, compressionLevel: 9 })
        .toFile(outputPath);
    } else {
      // Convert to JPEG for photos
      const jpegPath = outputPath.replace(/\.png$/i, '.jpg');
      await sharp(inputPath)
        .resize(resizeOptions)
        .jpeg({ quality: QUALITY, progressive: true })
        .toFile(jpegPath);
    }
    
    const outputSize = await getFileSize(outputPath);
    const outputSizeMB = (outputSize / (1024 * 1024)).toFixed(2);
    
    console.log(`  ✓ Original: ${fileSizeMB}MB`);
    console.log(`  ✓ Optimized: ${outputSizeMB}MB`);
    console.log(`  ✓ WebP: ${webpSizeMB}MB`);
    console.log(`  ✓ Saved: ${((1 - webpSize/fileSize) * 100).toFixed(1)}%\n`);
    
    return {
      original: fileSize,
      optimized: outputSize,
      webp: webpSize,
      path: fileName
    };
  } catch (error) {
    console.error(`  ✗ Error processing ${fileName}:`, error.message);
    return null;
  }
}

async function processDirectory(inputDir, outputDir) {
  // Create output directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });
  
  // Get all image files
  const files = await fs.readdir(inputDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );
  
  console.log(`Found ${imageFiles.length} images to optimize\n`);
  
  const results = [];
  
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    const result = await optimizeImage(inputPath, outputPath);
    if (result) results.push(result);
  }
  
  // Print summary
  const totalOriginal = results.reduce((sum, r) => sum + r.original, 0);
  const totalWebP = results.reduce((sum, r) => sum + r.webp, 0);
  
  console.log('\n=== OPTIMIZATION COMPLETE ===');
  console.log(`Total original size: ${(totalOriginal / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`Total WebP size: ${(totalWebP / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`Total saved: ${((1 - totalWebP/totalOriginal) * 100).toFixed(1)}%`);
}

async function main() {
  console.log('Starting image optimization...\n');
  
  // Process each directory
  const directories = [
    'public/images/homepage',
    'public/images/Chairs-Recliners',
    'public/images/Sofas-Loveseats',
    'public/images/Tables',
    'public/images/Tablesets',
    'public/images/ChaiseLounges',
    'public/images/Ottomans',
    'public/images'
  ];
  
  for (const dir of directories) {
    const inputDir = path.join(__dirname, dir);
    const outputDir = path.join(__dirname, dir + '-optimized');
    
    try {
      await fs.access(inputDir);
      console.log(`\n=== Processing ${dir} ===\n`);
      await processDirectory(inputDir, outputDir);
    } catch (error) {
      console.log(`Skipping ${dir} (not found)`);
    }
  }
  
  console.log('\n✅ All done! Check the -optimized folders for your compressed images.');
  console.log('WebP files have been created alongside the originals.');
  console.log('\nNext steps:');
  console.log('1. Review the optimized images for quality');
  console.log('2. If satisfied, replace the original images');
  console.log('3. Update your code to use .webp extensions where possible');
}

main().catch(console.error);