const fs = require('fs');
const path = require('path');

// Base folder to scan
const baseDir = path.join(__dirname, 'src');

// Allowed image extensions
const imgExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg'];

// Recursively get all files in folder
function getAllFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  });
  return files;
}

// Check imports in JS/JSX files
const allFiles = getAllFiles(baseDir);
const jsFiles = allFiles.filter(f => f.endsWith('.js') || f.endsWith('.jsx'));

let missingFiles = [];

jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1];
    const ext = path.extname(importPath).toLowerCase();
    if (imgExts.includes(ext)) {
      // Resolve the full path
      const imgFullPath = path.join(path.dirname(file), importPath);
      if (!fs.existsSync(imgFullPath)) {
        missingFiles.push({file, importPath});
      }
    }
  }
});

if (missingFiles.length === 0) {
  console.log('✅ All image imports are correct!');
} else {
  console.log('❌ Missing or mis-cased image files:');
  missingFiles.forEach(f => console.log(`File: ${f.file} -> Import: ${f.importPath}`));
}
