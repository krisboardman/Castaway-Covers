#!/bin/bash

echo "🚀 Preparing Castaway Covers for production deployment..."
echo ""

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

# Initialize git if not already initialized
if [ ! -d .git ]; then
    echo ""
    echo "📝 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Site ready for launch"
    echo "✅ Git repository created!"
else
    echo ""
    echo "📝 Creating new commit..."
    git add .
    git commit -m "Updates: Improved homepage, design page, added Diamond Red color, removed phone references"
    echo "✅ Changes committed!"
fi

echo ""
echo "🎉 Everything is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Connect to GitHub (if not already connected):"
echo "   git remote add origin YOUR_GITHUB_REPO_URL"
echo ""
echo "2. Push to GitHub (Vercel will auto-deploy):"
echo "   git push -u origin main"
echo ""
echo "OR deploy directly to Vercel:"
echo "   npx vercel --prod"
echo ""
echo "Your site improvements:"
echo "✅ Professional homepage with 3-panel story"
echo "✅ Enhanced design page with descriptions"
echo "✅ Diamond Red premium color option"
echo "✅ Cleaner layout with better spacing"
echo "✅ Removed phone references (email only)"
echo "✅ Improved feature descriptions"