#!/bin/bash

# Sync images from OneDrive to Git repository
echo "🔄 Syncing images from OneDrive..."
rsync -av --include="*.jpg" --include="*.jpeg" --include="*.png" --include="*.JPG" --include="*.JPEG" --include="*.PNG" --include="*/" --exclude="*" ~/Library/CloudStorage/OneDrive-Personal/Documents/GitHub/Castaway-Covers/public/images/ ~/Desktop/Castaway-Covers/public/images/

# Check for changes
cd ~/Desktop/Castaway-Covers
if git diff --quiet; then
    echo "✅ No image changes detected"
else
    echo "📸 Image changes detected!"
    git add .
    git commit -m "Update product images"
    git push
    echo "✅ Images updated and pushed to GitHub!"
    echo "⏳ Vercel will deploy in 1-2 minutes"
fi