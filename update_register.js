const fs = require('fs');
const path = '/home/ubuntu/apps/tiffany-models-academy/src/app/register/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `    setIsLoading(false);
    
    // TEMPORARY LOGIC: Auto-assign admin if email matches
    const role = formData.email.toLowerCase() === 'darmawanbayu1@gmail.com' ? 'admin' : 'model';
    localStorage.setItem('tma_user', JSON.stringify({
      email: formData.email,
      fullName: formData.fullName,
      role: role
    }));

    toast.success(role === 'admin' ? "Welcome, Director!" : "Welcome to the Academy!", {`;

content = content.replace('    setIsLoading(false);\n    toast.success("Welcome to the Academy!", {', replacement);

fs.writeFileSync(path, content);
