import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/Theming/theme-provider";
import { Toaster } from "react-hot-toast";
import Navbar from "@/Custom Components/Navbar/page";
import { SupabaseProvider } from "@/lib/supabase-provider";
import ThemeToggle from "@/Custom Components/Theme Provider/page";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your App",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light">
          <SupabaseProvider>
            <div className="absolute top-0 right-0">
              <ThemeToggle />
              <Navbar />
            </div>
            {children}
            <Toaster position="top-right" />
            <Analytics />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
