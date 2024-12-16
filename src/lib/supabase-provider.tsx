"use client";

import { ReactNode } from "react";
import { supabase } from "@/lib/supabase-client";

export function SupabaseProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
