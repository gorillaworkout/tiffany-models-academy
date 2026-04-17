"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight, Sparkles, Loader2, Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();
  
  useEffect(() => {
    const savedUser = localStorage.getItem("tma_user");
    if (savedUser) {
      router.push("/dashboard");
    }
  }, [router]);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    whatsapp: "",
    instagram: "",
    height: "",
    weight: "",
    branch: "",
    batch: ""
  });

  const [studios, setStudios] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/studios').then(r => r.json()).then(data => {
      if(Array.isArray(data)) setStudios(data);
    });
    fetch('/api/batches').then(r => r.json()).then(data => {
      if(Array.isArray(data)) {
        // Only take Registration status
        setBatches(data.filter(b => b.status === 'Registration'));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.branch) {
      toast.error("Please select a branch location");
      return;
    }
    if (!formData.batch) {
      toast.error("Please select a batch");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      setIsLoading(false);
      if (!data.success) {
        toast.error("Registration failed", { description: data.error });
        return;
      }

      if (data.status === 'approved') {
         // Auto login if admin
         localStorage.setItem('tma_user', JSON.stringify({ email: formData.email, fullName: formData.fullName, role: 'admin' }));
         toast.success("Welcome, Director!", { description: "Your admin account is ready." });
         setTimeout(() => router.push('/dashboard'), 1500);
      } else {
         // Student needs approval
         toast.success("Registration Sent", { description: "Please wait for admin approval before logging in!" });
         // DO NOT LOG IN. Redirect to login page instead
         setTimeout(() => router.push('/login'), 2000);
      }
    } catch (e: any) {
       setIsLoading(false);
       toast.error("Error", { description: e.message });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col lg:flex-row">
      
      {/* Left Side - Image/Brand (Sticky on Desktop, hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 lg:fixed lg:inset-y-0 lg:left-0 relative flex-col justify-between p-12 xl:p-16 border-r border-white/10 bg-zinc-950">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <img 
            src="/images/tma-group.jpg" 
            alt="Fashion Model" 
            className="w-full h-full object-cover filter grayscale"
          />
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-white" />
          <h2 className="text-2xl font-serif italic tracking-widest text-white">TMA</h2>
        </div>

        <div className="relative z-10 max-w-lg mb-8">
          <h1 className="text-5xl xl:text-7xl font-serif mb-6 leading-tight">
            Redefine <br />
            <span className="italic text-zinc-400">the runway.</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed font-light">
            Join the most exclusive modeling academy. Master the walk, perfect your pose, and build a professional portfolio that stands out in the industry.
          </p>
        </div>
      </div>

      {/* Right Side - Form (Scrollable on Mobile) */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] min-h-screen flex items-center justify-center p-6 sm:p-12 relative">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10 py-10">
          
          {/* Mobile Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              <Sparkles className="w-5 h-5 text-zinc-400" />
              <span className="font-serif italic tracking-widest text-sm text-zinc-400">TMA</span>
            </div>
            <h2 className="text-3xl font-serif mb-2">Create Account</h2>
            <p className="text-sm text-zinc-400">Enter your details to join the academy.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* ROW 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs uppercase tracking-widest text-zinc-500">Full Name</Label>
                <Input 
                  id="fullName" required placeholder="Tiffany Doe"
                  className="bg-zinc-900/50 border-white/10 h-12 px-4 text-sm focus-visible:ring-1 focus-visible:ring-white/30 rounded-none transition-all"
                  value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest text-zinc-500">Email</Label>
                <Input 
                  id="email" type="email" required placeholder="tiffany@mail.com"
                  className="bg-zinc-900/50 border-white/10 h-12 px-4 text-sm focus-visible:ring-1 focus-visible:ring-white/30 rounded-none transition-all"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* ROW 2: WhatsApp & Instagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-xs uppercase tracking-widest text-zinc-500">WhatsApp</Label>
                <Input 
                  id="whatsapp" required placeholder="+62 8..."
                  className="bg-zinc-900/50 border-white/10 h-12 px-4 text-sm focus-visible:ring-1 focus-visible:ring-white/30 rounded-none transition-all"
                  value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-xs uppercase tracking-widest text-zinc-500">Instagram</Label>
                <Input 
                  id="instagram" placeholder="@username"
                  className="bg-zinc-900/50 border-white/10 h-12 px-4 text-sm focus-visible:ring-1 focus-visible:ring-white/30 rounded-none transition-all"
                  value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                />
              </div>
            </div>

            {/* ROW 3: Height & Weight */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-xs uppercase tracking-widest text-zinc-500">Height (cm)</Label>
                <Input 
                  id="height" type="number" placeholder="170"
                  className="bg-zinc-900/50 border-white/10 h-12 px-4 text-sm focus-visible:ring-1 focus-visible:ring-white/30 rounded-none transition-all"
                  value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-xs uppercase tracking-widest text-zinc-500">Weight (kg)</Label>
                <Input 
                  id="weight" type="number" placeholder="50"
                  className="bg-zinc-900/50 border-white/10 h-12 px-4 text-sm focus-visible:ring-1 focus-visible:ring-white/30 rounded-none transition-all"
                  value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
              </div>
            </div>

            {/* ROW 4: Branch & Batch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-zinc-500">Branch</Label>
                <Select onValueChange={(val) => setFormData({...formData, branch: val})}>
                  <SelectTrigger className="bg-zinc-900/50 border-white/10 h-12 px-4 text-sm rounded-none focus:ring-1 focus:ring-white/30">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-none max-h-[200px] z-[100]">
                    {studios.map(s => (
                       <SelectItem key={s.id} value={s.id} className="focus:bg-white/10 focus:text-white cursor-pointer">{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-zinc-500">Batch</Label>
                <Select disabled={!formData.branch} onValueChange={(val) => setFormData({...formData, batch: val})}>
                  <SelectTrigger className="bg-zinc-900/50 border-white/10 h-12 px-4 text-sm rounded-none focus:ring-1 focus:ring-white/30 disabled:opacity-30">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-none max-h-[200px] z-[100]">
                    {batches.filter(b => b.branch === formData.branch).length === 0 ? (
                      <div className="py-3 px-4 text-xs text-zinc-500 italic text-center">Currently no active batches available at this location. Please check back later or contact our admin.</div>
                    ) : (
                      batches.filter(b => b.branch === formData.branch).map(b => (
                         <SelectItem key={b.id} value={b.id} className="focus:bg-white/10 focus:text-white cursor-pointer">{b.name} ({b.maxStudents || 30} Quota)</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ROW 5: Password */}
            <div className="space-y-2 pt-2 border-t border-white/5 mt-6">
              <Label htmlFor="password" className="text-xs uppercase tracking-widest text-zinc-500">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="••••••••"
                  className="bg-zinc-900/50 border-white/10 h-12 px-4 pr-10 text-sm focus-visible:ring-1 focus-visible:ring-white/30 rounded-none transition-all"
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" disabled={isLoading || !formData.fullName || !formData.email || !formData.password || !formData.whatsapp || !formData.branch || !formData.batch}
              className="w-full h-12 mt-4 bg-white text-black hover:bg-zinc-200 rounded-none text-xs tracking-widest flex items-center justify-center gap-2 group transition-all font-bold uppercase disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <>Submit Application <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
            
            <p className="text-center text-xs text-zinc-500 mt-4">
              Already a member? <a href="/login" className="text-white hover:underline underline-offset-4">Sign in here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
