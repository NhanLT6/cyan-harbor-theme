#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create releases folder if it doesn't exist
const releasesDir = path.join(__dirname, 'releases');
if (!fs.existsSync(releasesDir)) {
  fs.mkdirSync(releasesDir, { recursive: true });
}

// Version comes from package.json — bump it there, then run build
const version = require('./package.json').version;

// Define output file
const outputFilename = `ocean-harbor-${version}.jar`;
const outputPath = path.join(releasesDir, outputFilename);

// Create the JAR file (which is just a ZIP)
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } });

// Error handling
output.on('error', (err) => {
  console.error('❌ Error writing JAR:', err);
  process.exit(1);
});

archive.on('error', (err) => {
  console.error('❌ Error creating archive:', err);
  process.exit(1);
});

archive.pipe(output);

// Add files to the archive
console.log('🔨 Building theme JAR...');

// Add META-INF folder
archive.directory('META-INF/', 'META-INF');
console.log('  ✓ Added META-INF/');

// Add theme files
archive.file('ocean-harbor.xml', { name: 'ocean-harbor.xml' });
console.log('  ✓ Added ocean-harbor.xml');

archive.file('ocean-harbor.theme.json', { name: 'ocean-harbor.theme.json' });
console.log('  ✓ Added ocean-harbor.theme.json');

// Finalize the archive
output.on('close', () => {
  console.log(`\n✅ Theme JAR created successfully!`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 Size: ${(archive.pointer() / 1024).toFixed(2)} KB`);
  console.log(`🏷️  Version: ${version}\n`);
  process.exit(0);
});

archive.finalize();
