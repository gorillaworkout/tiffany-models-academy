const fs = require('fs');

const loginPath = '/home/ubuntu/apps/tiffany-models-academy/src/app/login/page.tsx';
let loginContent = fs.readFileSync(loginPath, 'utf8');
if (!loginContent.includes('useEffect')) {
  loginContent = loginContent.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";\nimport { useRouter } from "next/navigation";');
  loginContent = loginContent.replace('export default function LoginPage() {', 'export default function LoginPage() {\n  const router = useRouter();\n  useEffect(() => { if(localStorage.getItem("tma_user")) router.push("/dashboard"); }, []);');
  fs.writeFileSync(loginPath, loginContent);
}

const registerPath = '/home/ubuntu/apps/tiffany-models-academy/src/app/register/page.tsx';
let registerContent = fs.readFileSync(registerPath, 'utf8');
if (!registerContent.includes('useEffect')) {
  registerContent = registerContent.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";\nimport { useRouter } from "next/navigation";');
  registerContent = registerContent.replace('export default function RegisterPage() {', 'export default function RegisterPage() {\n  const router = useRouter();\n  useEffect(() => { if(localStorage.getItem("tma_user")) router.push("/dashboard"); }, []);');
  fs.writeFileSync(registerPath, registerContent);
}

const dashPath = '/home/ubuntu/apps/tiffany-models-academy/src/app/dashboard/page.tsx';
let dashContent = fs.readFileSync(dashPath, 'utf8');
if (!dashContent.includes('if (!savedUser) {')) {
  dashContent = dashContent.replace('if (savedUser) {', 'if (!savedUser) {\n      window.location.href = "/login";\n      return;\n    }\n    if (savedUser) {');
  fs.writeFileSync(dashPath, dashContent);
}
