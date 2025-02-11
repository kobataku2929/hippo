"use server";
import { cookies } from "next/headers";

export async function preferredCalendarTypeViewCookiesSet(
  calendarType: string
) {
  const cookieStore = cookies();
  cookieStore.set("preferredCalendarTypeView", calendarType, { path: "/" });
}
export async function preferredMonthlyShiftViewCookiesSet(monthDate: string) {
  const cookieStore = cookies();
  cookieStore.set("preferredMonthlyShiftView", monthDate, {
    path: "/",
  });
}
