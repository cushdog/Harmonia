import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/types_db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LogOut, LogIn } from "lucide-react";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Card className="w-full max-w-md border dark:border-gray-800 dark:bg-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Welcome!
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/login">
              <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white transition-colors">
                <LogIn className="w-4 h-4" />
                Log In or Sign Up
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const user = session.user;
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Card className="w-full max-w-md border dark:border-gray-800 dark:bg-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action="/api/logout"
            method="post"
            className="flex justify-center"
          >
            <Button
              variant="outline"
              className="gap-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
