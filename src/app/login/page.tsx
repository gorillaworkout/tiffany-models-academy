"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight, Sparkles, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    const savedUser = localStorage.getItem("tma_user");
    if (savedUser) {
      router.push("/dashboard");
    }
  }, [router]);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    // TEMPORARY LOGIC: Auto-assign admin if email matches
    const role = email.toLowerCase() === 'darmawanbayu1@gmail.com' ? 'admin' : 'model';
    localStorage.setItem('tma_user', JSON.stringify({
      email: email,
      fullName: role === 'admin' ? "Bayu Darmawan" : "Model Member",
      role: role
    }));

    toast.success(role === 'admin' ? "Welcome back, Director!" : "Login successful!", {
      description: "Authenticating your credentials...",
    });
    
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col lg:flex-row">
      
      {/* Left Side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 lg:fixed lg:inset-y-0 lg:left-0 relative flex-col justify-between p-12 xl:p-16 border-r border-white/10 bg-zinc-950">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <img 
            src="/images/tma-magazine.jpg" 
            alt="Fashion Model Cover" 
            className="w-full h-full object-cover filter grayscale"
          />
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-white" />
          <h2 className="text-2xl font-serif italic tracking-widest text-white">TMA</h2>
        </div>

        <div className="relative z-10 max-w-lg mb-8">
          <h1 className="text-5xl xl:text-7xl font-serif mb-6 leading-tight">
            Own the <br />
            <span className="italic text-zinc-400">spotlight.</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed font-light">
            Welcome back to the academy. Access your training modules, check your upcoming schedule, and track your progress.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] min-h-screen flex items-center justify-center p-6 sm:p-12 relative">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-sm relative z-10">
          
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6 lg:hidden">
              <Sparkles className="w-5 h-5 text-zinc-400" />
              <span className="font-serif italic tracking-widest text-sm text-zinc-400">TMA</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif mb-3">Sign In</h2>
            <p className="text-sm text-zinc-400">Enter your email and password to access your portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest text-zinc-500">Email Address</Label>
              <Input 
                id="email" type="email" required placeholder="tiffany@mail.com"
                className="bg-zinc-900/50 border-white/10 h-12 px-4 text-sm focus-visible:ring-1 focus-visible:ring-white/30 rounded-none transition-all"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs uppercase tracking-widest text-zinc-500">Password</Label>
                <a href="#" className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••"
                  className="bg-zinc-900/50 border-white/10 h-12 px-4 pr-10 text-sm focus-visible:ring-1 focus-visible:ring-white/30 rounded-none transition-all"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" disabled={isLoading}
              className="w-full h-12 mt-4 bg-white text-black hover:bg-zinc-200 rounded-none text-xs tracking-widest flex items-center justify-center gap-2 group transition-all font-bold uppercase"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-black px-4 text-zinc-600">New to the academy?</span>
              </div>
            </div>

            <Link 
              href="/register"
              className="w-full flex items-center justify-center h-12 border border-white/20 text-white hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              Apply for Next Batch
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
