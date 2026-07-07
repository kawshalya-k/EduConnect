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
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace font-['Lexend'] or font-['Outfit'] etc with font-sans
    const hasHardcodedFont = /font-\['[^']+'\]/g.test(content);
    if (hasHardcodedFont) {
      content = content.replace(/font-\['[^']+'\]/g, 'font-sans');
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedCount++;
      console.log(`Cleaned font in JSX: ${filePath}`);
    }
  }
});

console.log(`\nCompleted! Modified ${modifiedCount} JSX/JS files.`);
