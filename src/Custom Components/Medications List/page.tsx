"use client";

import { useState } from 'react';
import { Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { logMedicationTaken } from '@/app/actions/medications/actions';
import { format } from 'date-fns';
import { Database } from '@/types/types_db';

type Medication = Database['public']['Tables']['medications']['Row'];
type MedicationLog = Database['public']['Tables']['medication_logs']['Row'];

interface MedicationsListProps {
  medications: Medication[];
  logs: MedicationLog[];
  onLogUpdate: (newLog: MedicationLog) => void;
  onLogRemove: (medicationId: string, scheduledTime: string) => void;
}

interface DoseTime {
  time: string;
  formattedTime: string;
}

export default function MedicationsList({ 
  medications, 
  logs,
  onLogUpdate,
  onLogRemove 
}: MedicationsListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const isToday = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getTodaysDoses = (medication: Medication): DoseTime[] => {
    return medication.time_of_day
      .sort()
      .map(time => ({
        time,
        formattedTime: format(new Date().setHours(
          parseInt(time.split(':')[0], 10),
          parseInt(time.split(':')[1], 10),
          0, 0
        ), 'h:mm a')
      }));
  };

  const isMedicationTaken = (medicationId: string, scheduledTime: string): boolean => {
    return logs.some(log => 
      log.medication_id === medicationId && 
      log.scheduled_time === scheduledTime &&
      isToday(log.taken_at)
    );
  };

  const handleLogMedication = async (medicationId: string, scheduledTime: string) => {
    const key = `${medicationId}-${scheduledTime}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    try {
      const taken = isMedicationTaken(medicationId, scheduledTime);
      
      if (taken) {
        onLogRemove(medicationId, scheduledTime);
      } else {
        await logMedicationTaken(medicationId, scheduledTime);
        const newLog: MedicationLog = {
          medication_id: medicationId,
          scheduled_time: scheduledTime,
          taken_at: new Date().toISOString(),
          user_id: '',
          id: '',
        };
        onLogUpdate(newLog);
      }
    } catch (error) {
      console.error('Error logging medication:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="rounded-md border border-border dark:border-gray-700 bg-white dark:bg-black">
      <Table className='dark:bg-black'>
        <TableHeader>
          <TableRow className="dark:border-gray-700">
            <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
            <TableHead className="text-gray-900 dark:text-white">Medication</TableHead>
            <TableHead className="text-gray-900 dark:text-white">Dosage</TableHead>
            <TableHead className="text-gray-900 dark:text-white">Schedule</TableHead>
            <TableHead className="text-gray-900 dark:text-white">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((med) => {
            const todaysDoses = getTodaysDoses(med);
            const allTaken = todaysDoses.every(({ time }) => 
              isMedicationTaken(med.id, time)
            );

            return (
              <TableRow 
                key={med.id} 
                className={
                  allTaken 
                    ? "bg-green-50 hover:bg-green-100 dark:bg-black dark:bg-green-900 dark:hover:bg-green-800" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }
              >
                <TableCell>
                  {todaysDoses.map(({ time }) => (
                    <div key={time} className="mb-2 last:mb-0">
                      {isMedicationTaken(med.id, time) ? (
                        <span className="inline-flex items-center text-green-600 dark:text-green-400">
                          <Check className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-blue-600 dark:text-blue-400">
                          <Clock className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  ))}
                </TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {med.name}
                </TableCell>
                <TableCell className="text-gray-900 dark:text-white">
                  {med.dosage || 'Not specified'}
                </TableCell>
                <TableCell>
                  {todaysDoses.map(({ time, formattedTime }) => (
                    <div key={time} className="mb-2 last:mb-0">
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {formattedTime}
                      </span>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {todaysDoses.map(({ time }) => {
                    const key = `${med.id}-${time}`;
                    const taken = isMedicationTaken(med.id, time);
                    const isLoading = loadingStates[key];
                    
                    return (
                      <div key={time} className="mb-2 last:mb-0">
                        <Button
                          size="sm"
                          variant={taken ? "outline" : "default"}
                          onClick={() => handleLogMedication(med.id, time)}
                          disabled={isLoading}
                          className="dark:border-gray-600 dark:hover:border-gray-500"
                        >
                          {isLoading ? (
                            "Updating..."
                          ) : taken ? (
                            "Mark Not Taken"
                          ) : (
                            "Mark as Taken"
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </TableCell>
              </TableRow>
            );
          })}
          {medications.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={5} 
                className="text-center text-gray-500 dark:text-gray-400"
              >
                No medications added yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
