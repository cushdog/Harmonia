'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { format } from 'date-fns';
import { logMedicationTaken } from '@/app/actions/medications/actions';
import { Database } from '@/types/types_db';

type Medication = Database['public']['Tables']['medications']['Row'];
type MedicationLog = Database['public']['Tables']['medication_logs']['Row'];

interface MedicationTime {
  time: string;
  taken: boolean;
  scheduledTime: Date;
}

interface MedicationWithTimes extends Medication {
  times: MedicationTime[];
}

interface MedicationCalendarProps {
  medications: Medication[];
  logs: MedicationLog[];
}

export default function MedicationCalendar({ medications, logs }: MedicationCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [localLogs, setLocalLogs] = useState<MedicationLog[]>(logs);

  useEffect(() => {
    setLocalLogs(logs);
  }, [logs]);

  const handleLogMedication = async (medicationId: string, scheduledTime: string): Promise<void> => {
    const key = `${medicationId}-${scheduledTime}`;
    setLoading((prev) => ({ ...prev, [key]: true }));
    try {
      await logMedicationTaken(medicationId, scheduledTime);
      setLocalLogs((prev) => {
        const existingLog = prev.find(
          (log) =>
            log.medication_id === medicationId && log.scheduled_time === scheduledTime
        );
        if (existingLog) {
          return prev.filter(
            (log) =>
              !(
                log.medication_id === medicationId &&
                log.scheduled_time === scheduledTime
              )
          );
        } else {
          return [
            ...prev,
            {
              medication_id: medicationId,
              scheduled_time: scheduledTime,
              taken_at: new Date().toISOString(),
              user_id: '', // Filled by server
              id: '', // Filled by server
            },
          ];
        }
      });
    } catch (error) {
      console.error('Error logging medication:', error);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const getMedicationsForDate = (date: Date): MedicationWithTimes[] => {
    return medications.map((med) => {
      const times = med.time_of_day.map((time) => {
        const [hours, minutes] = time.split(':');
        const scheduleDate = new Date(date);
        scheduleDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        const taken = localLogs.some(
          (log) =>
            log.medication_id === med.id &&
            new Date(log.taken_at).toDateString() === date.toDateString() &&
            log.scheduled_time === time
        );

        return {
          time,
          taken,
          scheduledTime: scheduleDate,
        };
      });

      return {
        ...med,
        times,
      };
    });
  };

  const isDateComplete = (date: Date): boolean => {
    const medsForDate = getMedicationsForDate(date);
    return medsForDate.every((med) => med.times.every((time) => time.taken));
  };

  const selectedDayMedications = getMedicationsForDate(selectedDate);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
          className="rounded-md border dark:border-gray-700 dark:bg-gray-800"
          modifiers={{
            completed: (date) => isDateComplete(date),
          }}
          modifiersClassNames={{
            completed: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
          }}
        />
      </div>
      <div className="space-y-4">
        <CardHeader className="p-0">
          <CardTitle className="text-xl dark:text-gray-200">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            {selectedDayMedications.length} medications scheduled
          </CardDescription>
        </CardHeader>
        <div className="space-y-2">
          {selectedDayMedications.map((med) => (
            <Card
              key={med.id}
              className="bg-card dark:bg-gray-800 dark:border-gray-700"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium dark:text-gray-200">{med.name}</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      {med.dosage || 'No dosage specified'}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {med.times.map(({ time, taken, scheduledTime }) => {
                      const key = `${med.id}-${time}`;
                      return (
                        <div
                          key={time}
                          className="flex items-center justify-between space-x-4"
                        >
                          <span
                            className={`text-sm pr-8 ${
                              taken
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-muted-foreground dark:text-gray-400'
                            }`}
                          >
                            {format(scheduledTime, 'h:mm a')}
                          </span>
                          <Button
                            size="sm"
                            variant={taken ? 'outline' : 'default'}
                            onClick={() =>
                              handleLogMedication(
                                med.id,
                                scheduledTime.toTimeString().slice(0, 5)
                              )
                            }
                            disabled={loading[key]}
                            className="min-w-[140px]"
                          >
                            {loading[key]
                              ? 'Updating...'
                              : taken
                              ? 'Mark Not Taken'
                              : 'Mark as Taken'}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {selectedDayMedications.length === 0 && (
            <p className="text-center text-muted-foreground dark:text-gray-400 py-4">
              No medications scheduled for this day
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
