"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    branch: "",
    classType: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register data:", formData);
    // In a real app, this would send data to the server
    alert("Registration successful! Please login.");
    window.location.href = "/login";
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md my-12">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Register Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Tiffany Models Academy today
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <div className="mt-1">
              <Input 
                required 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1">
              <Input 
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1">
              <Input 
                type="password" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <div className="mt-1 flex space-x-4">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="gender" 
                  value="male" 
                  required
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                />
                <span className="ml-2 text-sm text-gray-700">Male</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="gender" 
                  value="female" 
                  required
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                />
                <span className="ml-2 text-sm text-gray-700">Female</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cabang (Location)</label>
            <div className="mt-1">
              <select
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
              >
                <option value="">Pilih Cabang</option>
                <option value="jakarta_pusat">Jakarta Pusat</option>
                <option value="jakarta_selatan">Jakarta Selatan</option>
                <option value="bandung">Bandung</option>
                <option value="surabaya">Surabaya</option>
                <option value="bali">Bali</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Jenis Kelas</label>
            <div className="mt-1">
              <select
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.classType}
                onChange={(e) => setFormData({...formData, classType: e.target.value})}
              >
                <option value="">Pilih Jenis Kelas</option>
                <option value="beginner">Beginner Model Class</option>
                <option value="intermediate">Intermediate Model Class</option>
                <option value="advanced">Advanced Runway Class</option>
                <option value="commercial">Commercial Photo Shoot Class</option>
              </select>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>
          <div className="mt-6">
            <a
              href="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
