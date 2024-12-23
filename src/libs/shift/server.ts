"use server";
import { cookies } from "next/headers";

export async function preferredShiftTypeViewCookiesSet(calendarType: string) {
  const cookieStore = cookies();
  cookieStore.set("preferredShiftTypeView", calendarType, { path: "/" });
}
export async function preferredShiftMonthViewCookiesSet(monthDate: string) {
  const cookieStore = cookies();
  cookieStore.set("preferredShiftMonthView", monthDate, {
    path: "/",
  });
}
