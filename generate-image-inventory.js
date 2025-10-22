const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all image files
const imagesDir = 'public/images';
const imageFiles = execSync(`find ${imagesDir} -type f \\( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" \\)`, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(f => f);

// Get file sizes
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  const size = stats.size;
  if (size > 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    return `${(size / 1024).toFixed(1)} KB`;
  }
}

// Search for file references in src
function findUsages(fileName) {
  try {
    const result = execSync(`grep -r "${fileName}" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null || true`, { encoding: 'utf-8' });
    const lines = result.trim().split('\n').filter(l => l);

    if (lines.length === 0) return { count: 0, files: 'Not referenced' };

    const files = [...new Set(lines.map(line => {
      const match = line.match(/^([^:]+):/);
      return match ? match[1].replace('src/', '') : '';
    }).filter(f => f))];

    return { count: files.length, files: files.join('; ') };
  } catch (error) {
    return { count: 0, files: 'Not referenced' };
  }
}

// Process each image
const inventory = imageFiles.map(filePath => {
  const relativePath = filePath.replace('public/images/', '');
  const folder = relativePath.split('/')[0];
  const fileName = path.basename(filePath);
  const fileSize = getFileSize(filePath);
  const usage = findUsages(fileName);

  let status = 'ACTIVE';
  let notes = 'Product/feature image';

  if (usage.count === 0) {
    status = 'ORPHANED';
  }

  if (fileName.includes('sketch')) {
    notes = 'Sketch/icon';
  } else if (fileName.includes('logo')) {
    notes = 'Logo';
  } else if (fileName.includes('hero')) {
    notes = 'Hero banner image';
  } else if (fileName.includes('feature')) {
    notes = 'Feature/benefit showcase';
  } else if (fileName.includes('measurement')) {
    notes = 'Measurement guide';
  } else if (fileName.includes('color') || fileName.includes('front')) {
    notes = 'Color variant';
  } else if (fileName.includes('handle') || fileName.includes('snap') || fileName.includes('magnetic')) {
    notes = 'Add-on option detail';
  } else if (fileName.includes('gallery') || fileName.match(/Gallery\d/)) {
    notes = 'Gallery image';
  }

  return {
    Folder: folder,
    'Current Path': relativePath,
    'File Size': fileSize,
    'Used In (Files)': usage.files,
    'Usage Count': usage.count,
    'Description/Notes': notes,
    'Status': status
  };
});

// Sort by folder and status
inventory.sort((a, b) => {
  if (a.Folder !== b.Folder) return a.Folder.localeCompare(b.Folder);
  if (a.Status !== b.Status) return a.Status === 'ORPHANED' ? 1 : -1;
  return a['Current Path'].localeCompare(b['Current Path']);
});

// Create CSV
const headers = ['Folder', 'Current Path', 'File Size', 'Used In (Files)', 'Usage Count', 'Description/Notes', 'Status'];
const csvLines = [headers.join(',')];

inventory.forEach(item => {
  const row = headers.map(header => {
    let value = item[header];
    // Escape commas and quotes in CSV
    if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
      value = `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  });
  csvLines.push(row.join(','));
});

const csv = csvLines.join('\n');

// Write to file
fs.writeFileSync('castaway-images-inventory-updated.csv', csv);

console.log(`✓ Generated inventory with ${inventory.length} images`);
console.log(`✓ Active images: ${inventory.filter(i => i.Status === 'ACTIVE').length}`);
console.log(`✓ Orphaned images: ${inventory.filter(i => i.Status === 'ORPHANED').length}`);
console.log(`✓ Saved to: castaway-images-inventory-updated.csv`);
