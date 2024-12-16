'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useCustomToast } from '@/lib/Theming/toast';

const AuthForm = ({ 
  type,
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit 
}: { 
  type: 'login' | 'signup';
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor={`${type}-email`} className="text-gray-700 dark:text-gray-300">
        Email
      </Label>
      <Input
        id={`${type}-email`}
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={onEmailChange}
        required
        className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor={`${type}-password`} className="text-gray-700 dark:text-gray-300">
        Password
      </Label>
      <Input
        id={`${type}-password`}
        type="password"
        value={password}
        onChange={onPasswordChange}
        required
        className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-blue-500 dark:focus:ring-blue-400"
      />
    </div>
    <Button 
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white transition-colors"
      disabled={loading}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {type === 'login' ? 'Sign In' : 'Create Account'}
    </Button>
  </form>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useCustomToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    setLoading(false);
    
    if (error) {
      toast.error(error.message);
      return;
    }
    
    toast.success('Check your email to confirm your account!');
    router.push('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    setLoading(false);
    
    if (error) {
      toast.error(error.message);
      return;
    }
    
    toast.success('Successfully logged in!');
    router.push('/');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Card className="w-full max-w-md border dark:border-gray-800 dark:bg-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Welcome
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 dark:bg-gray-700">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 dark:text-gray-300 dark:data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 dark:text-gray-300 dark:data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <AuthForm 
                type="login"
                email={email}
                password={password}
                loading={loading}
                onEmailChange={(e) => setEmail(e.target.value)}
                onPasswordChange={(e) => setPassword(e.target.value)}
                onSubmit={handleLogin}
              />
            </TabsContent>
            <TabsContent value="signup">
              <AuthForm 
                type="signup"
                email={email}
                password={password}
                loading={loading}
                onEmailChange={(e) => setEmail(e.target.value)}
                onPasswordChange={(e) => setPassword(e.target.value)}
                onSubmit={handleSignUp}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}