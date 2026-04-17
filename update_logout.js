const fs = require('fs');
const path = '/home/ubuntu/apps/tiffany-models-academy/src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace all occurrences of redirecting to login/register after logout
content = content.replace(/window\.location\.href = "\/register";/g, 'window.location.href = "/";');
content = content.replace(/window\.location\.href = "\/login";/g, 'window.location.href = "/";');

fs.writeFileSync(path, content);
console.log("Logout redirects updated to /");
