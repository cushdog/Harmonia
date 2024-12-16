// app/medications/page.tsx
import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/types_db';
import { redirect } from 'next/navigation';
import MedicationsContainer from './MedicationsContainer';

export default async function MedicationsPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: medications } = await supabase
    .from('medications')
    .select('*')
    .eq('user_id', session.user.id)
    .order('name');

  // Get today's date in UTC
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString();

  const { data: todaysLogs } = await supabase
    .from('medication_logs')
    .select('*')
    .eq('user_id', session.user.id)
    .gte('taken_at', startOfDay)
    .lte('taken_at', endOfDay);

  return (
    <MedicationsContainer 
      initialMedications={medications || []}
      initialLogs={todaysLogs || []}
    />
  );
}