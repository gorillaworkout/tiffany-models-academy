const fs = require('fs');

const files = [
  '/home/ubuntu/apps/tiffany-models-academy/src/app/login/page.tsx',
  '/home/ubuntu/apps/tiffany-models-academy/src/app/register/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Make sure useEffect and useRouter are imported
  if (!content.includes('useEffect')) {
    content = content.replace('import { useState }', 'import { useState, useEffect }');
  }
  
  if (!content.includes('next/navigation')) {
    content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { useRouter } from "next/navigation";');
  } else if (!content.includes('useRouter')) {
    // If next/navigation exists but not useRouter
    content = content.replace('import { ', 'import { useRouter, ');
  }

  // Add the auth check inside the component
  const componentMatch = content.match(/export default function \w+\(\) \{/);
  if (componentMatch) {
    const checkCode = `
  const router = useRouter();
  
  useEffect(() => {
    const savedUser = localStorage.getItem("tma_user");
    if (savedUser) {
      router.push("/dashboard");
    }
  }, [router]);
`;
    // Only insert if not already there
    if (!content.includes('localStorage.getItem("tma_user")')) {
      content = content.replace(componentMatch[0], componentMatch[0] + checkCode);
    }
  }

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
