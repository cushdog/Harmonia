// MedicationsContainer.tsx (Client Component)
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddMedicationDialog from '@/Custom Components/Add Medication Dialog/page';
import MedicationsList from '@/Custom Components/Medications List/page';
import MedicationCalendar from '@/Custom Components/Medications Calendar/page';
import { Database } from '@/types/types_db';

type Medication = Database['public']['Tables']['medications']['Row'];
type MedicationLog = Database['public']['Tables']['medication_logs']['Row'];

interface MedicationsContainerProps {
  initialMedications: Medication[];
  initialLogs: MedicationLog[];
}

export default function MedicationsContainer({ 
  initialMedications,
  initialLogs 
}: MedicationsContainerProps) {
  const [medications] = useState<Medication[]>(initialMedications);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(initialLogs);

  const handleLogUpdate = (newLog: MedicationLog) => {
    setMedicationLogs(prev => [...prev, newLog]);
  };

  const handleLogRemove = (medicationId: string, scheduledTime: string) => {
    setMedicationLogs(prev => prev.filter(log => 
      !(log.medication_id === medicationId && 
        log.scheduled_time === scheduledTime &&
        new Date(log.taken_at).toDateString() === new Date().toDateString())
    ));
  };

  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Medication Tracker
          </h1>
          <AddMedicationDialog />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                  <MedicationsList 
                    medications={medications} 
                    logs={medicationLogs}
                    onLogUpdate={handleLogUpdate}
                    onLogRemove={handleLogRemove}
                  />
                </TabsContent>
                <TabsContent value="calendar">
                  <MedicationCalendar 
                    medications={medications} 
                    logs={medicationLogs}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Medication
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}