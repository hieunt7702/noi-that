const fs = require('fs');

console.log('Generating input.css...');

let bundle = fs.readFileSync('../css/v1-bundle.css', 'utf8');

// Also merge v2-bundle.css if we need to? No, the original only linked v1-bundle.css in both index and index-v2, wait let me check.
// I will just use v1-bundle.css for now.

const tailwindDirectives = `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  ${bundle}
}
`;

fs.writeFileSync('input.css', tailwindDirectives);
console.log('Successfully generated input.css');
