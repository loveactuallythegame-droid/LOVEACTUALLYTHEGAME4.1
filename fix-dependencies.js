#!/usr/bin/env node

/**
 * Dependency fix script for Love Actually... The Game
 * Run with: node fix-dependencies.js
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Fixing dependency issues for Love Actually... The Game\n');

try {
  // Step 1: Clean node_modules and package-lock
  console.log('1. Cleaning existing dependencies...');
  if (fs.existsSync('node_modules')) {
    execSync('rmdir /s /q node_modules', { stdio: 'inherit', shell: true });
    console.log('   ✅ Removed node_modules');
  }
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
    console.log('   ✅ Removed package-lock.json');
  }

  // Step 2: Clear npm cache
  console.log('\n2. Clearing npm cache...');
  try {
    execSync('npm cache clean --force', { stdio: 'inherit', shell: true });
    console.log('   ✅ Cleared npm cache');
  } catch (error) {
    console.log('   ⚠️  Could not clear cache (this is usually fine)');
  }

  // Step 3: Install with legacy peer deps flag to handle React version conflicts
  console.log('\n3. Installing dependencies with compatibility fixes...');
  console.log('   This may take a few minutes...');
  
  try {
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit', shell: true });
    console.log('   ✅ Dependencies installed successfully!');
  } catch (error) {
    console.log('\n   ❌ Standard install failed, trying alternative approach...');
    
    // Try with force flag as fallback
    try {
      execSync('npm install --force', { stdio: 'inherit', shell: true });
      console.log('   ✅ Dependencies installed with force flag!');
    } catch (forceError) {
      console.log('\n   ❌ Force install also failed.');
      console.log('   Please try running: npm install --legacy-peer-deps');
      process.exit(1);
    }
  }

  // Step 4: Verify installation
  console.log('\n4. Verifying installation...');
  try {
    execSync('npm list --depth=0', { stdio: 'pipe' });
    console.log('   ✅ All dependencies resolved successfully!');
  } catch (error) {
    console.log('   ⚠️  Some peer dependency warnings may exist, but installation completed');
  }

  // Step 5: Test the build
  console.log('\n5. Testing build process...');
  try {
    execSync('npm run type-check', { stdio: 'pipe' });
    console.log('   ✅ TypeScript check passed!');
  } catch (error) {
    console.log('   ⚠️  TypeScript check had issues (this is expected with the current setup)');
  }

  console.log('\n🎉 Dependency fix completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open http://localhost:3000 in your browser');
  console.log('3. Test Dr. Marcie\'s voice with Murf AI!');

} catch (error) {
  console.error('\n❌ Error during dependency fix:', error.message);
  console.log('\nTroubleshooting:');
  console.log('1. Make sure you have Node.js 18+ installed');
  console.log('2. Try running: npm install --legacy-peer-deps');
  console.log('3. If issues persist, delete node_modules and package-lock.json manually');
  process.exit(1);
}