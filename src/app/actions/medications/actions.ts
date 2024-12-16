"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/types_db";
import { revalidatePath } from "next/cache";

export async function createMedication(data: {
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string;
  notes: string;
}) {
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase.from("medications").insert({
    user_id: session.user.id,
    name: data.name,
    dosage: data.dosage,
    frequency: data.frequency,
    time_of_day: [data.timeOfDay],
    notes: data.notes,
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to create medication");
  }

  revalidatePath("/medications");
}

export async function logMedicationTaken(
  medicationId: string,
  scheduledTime: string
) {
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  // Get today's date in UTC
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).toISOString();
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  ).toISOString();

  // Check if log already exists for today
  const { data: existingLog } = await supabase
    .from("medication_logs")
    .select("*")
    .eq("medication_id", medicationId)
    .eq("scheduled_time", scheduledTime)
    .eq("user_id", session.user.id)
    .gte("taken_at", startOfDay)
    .lte("taken_at", endOfDay)
    .single();

  if (existingLog) {
    // Delete the log (toggle behavior)
    const { error } = await supabase
      .from("medication_logs")
      .delete()
      .eq("id", existingLog.id);

    if (error) {
      console.error(error);
      throw new Error("Failed to delete medication log");
    }
  } else {
    // Insert a new log
    const { error } = await supabase.from("medication_logs").insert({
      medication_id: medicationId,
      user_id: session.user.id,
      scheduled_time: scheduledTime,
      taken_at: new Date().toISOString(), // Explicitly set taken_at
    });

    if (error) {
      console.error(error);
      throw new Error("Failed to log medication");
    }
  }

  revalidatePath("/medications");
}

export async function deleteMedication(medicationId: string) {
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("medications")
    .delete()
    .eq("id", medicationId)
    .eq("user_id", session.user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to delete medication");
  }

  revalidatePath("/medications");
}
