"use server";
import { createClient } from "@/utils/supabase/server";
const supabase = createClient();

export const updateDailyShift = async (
  userId: string | null,
  fromTime: string,
  toTime: string,
  id: number
) => {
  const updateData = {
    from_time: fromTime,
    to_time: toTime,
    ...(userId && { user_id: userId }),
  };

  const { error } = await supabase
    .from("shifts")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating shift:", error);
  }
};
