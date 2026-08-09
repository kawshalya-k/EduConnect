import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

let modifiedCount = 0;

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Only remove font-family rules
    const hasFontFamily = /font-family\s*:[^;]+;/gi.test(content);
    if (hasFontFamily) {
      content = content.replace(/\s*font-family\s*:[^;]+;/gi, '');
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedCount++;
      console.log(`Cleaned font-family in: ${filePath}`);
    }
  }
});

console.log(`\nCompleted! Modified ${modifiedCount} CSS files.`);
