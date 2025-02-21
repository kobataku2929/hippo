import { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*, prices(*, products(*))")
    .in("status", ["trialing", "active"])
    .maybeSingle();
  if (!error) {
    return subscription;
  }
});

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { referencedTable: "prices" });
  if (!error) {
    return products;
  }
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from("users")
    .select("*")
    .single();
  return userDetails;
});

export const getDailyShifts = cache(
  async (supabase: SupabaseClient, fromTime: string, toTime: string) => {
    const { data: dailyShifts } = await supabase
      .from("shifts")
      .select("*, profiles(user_name)")
      .in("user_id", [
        "185f2f83-d63a-4c9b-b4a0-7e4a885799e2",
        "185f2f83-d63a-4c9b-b4a0-7e4a885799e1",
        "185f2f83-d63a-4c9b-b4a0-7e4a885799e3",
      ])
      .gte("from_time", fromTime)
      .lt("to_time", toTime);
    return dailyShifts;
  }
);

export const getWorkers = cache(
  async (supabase: SupabaseClient, workPlace: string) => {
    const { data: workers } = await supabase
      .from("profiles")
      .select("*")
      .eq("work_place", workPlace);
    return workers;
  }
);
