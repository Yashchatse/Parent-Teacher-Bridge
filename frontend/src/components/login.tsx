"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';
import { loginService } from '../services/loginService';
import { parentService } from '../services/parentService';

interface LoginProps {
  onLogin: (userData: any) => void;
  onBack?: () => void;
}

export default function Login({ onLogin, onBack }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast("Error", "Please fill in all fields", {
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log(`🔐 Attempting admin login with:`, { email });
      
      const result = await loginService.adminLogin(email, password);
      
      if (result.success) {
        toast("Success", "Login successful!", {});
        onLogin(result.user);
      } else {
        toast("Error", result.error, {
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      toast("Error", "Login failed. Please try again.", {
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
         
          <CardTitle className="text-2xl font-bold text-center">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your administrator credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
         {onBack && (
           <Button
           type="button"
           variant="ghost"
           onClick={onBack}
           className="self-start mb-2"
           >
              ← Back to Role Selection
            </Button>
          )}
      </Card>
    </div>
  );
}
