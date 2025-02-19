"use server";
import { createClient } from "@/utils/supabase/server";
const supabase = createClient();

export const updateDailyShift = async (
  fromTime: string,
  toTime: string,
  id: number
) => {
  const { error } = await supabase
    .from("shifts")
    .update({
      from_time: fromTime,
      to_time: toTime,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating shift:", error);
  }
};
