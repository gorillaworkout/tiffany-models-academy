const fs = require('fs');

// Fix Login and Register (Use next/router for instant SPA transition instead of hard reload)
['src/app/login/page.tsx', 'src/app/register/page.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if(!content.includes('useRouter')) {
    content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useRouter } from "next/navigation";');
    content = content.replace('const [isLoading, setIsLoading] = useState(false);', 'const router = useRouter();\n  const [isLoading, setIsLoading] = useState(false);');
    content = content.replace(/window\.location\.href = "\/dashboard";/g, 'router.push("/dashboard");');
    fs.writeFileSync(file, content);
    console.log('Fixed routing in', file);
  }
});

// Fix Dashboard (Hydration flashing and animation delays)
const dashPath = 'src/app/dashboard/page.tsx';
let dashContent = fs.readFileSync(dashPath, 'utf8');
if(!dashContent.includes('isMounted')) {
    dashContent = dashContent.replace('const [userRole, setUserRole] = useState("model");', 'const [isMounted, setIsMounted] = useState(false);\n  const [userRole, setUserRole] = useState("model");');
    
    dashContent = dashContent.replace("setUserName(parsed.fullName.split(' ')[0]); // Get first name\n    }\n  }, []);", "setUserName(parsed.fullName.split(' ')[0]);\n    }\n    setIsMounted(true);\n  }, []);");
    
    dashContent = dashContent.replace('const containerVariants = {', 'if (!isMounted) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white font-serif italic tracking-widest animate-pulse">TMA</div></div>;\n\n  const containerVariants = {');
    
    // Speed up framer-motion animations
    dashContent = dashContent.replace(/delay: 0\.3/g, 'delay: 0.1');
    dashContent = dashContent.replace(/delay: 0\.4/g, 'delay: 0.15');
    
    fs.writeFileSync(dashPath, dashContent);
    console.log('Fixed delays and hydration in dashboard');
}
