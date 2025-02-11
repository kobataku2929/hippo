"use server";
import { cookies } from "next/headers";

/**
 * 選択されたカレンダーの種類をクッキーに保存します
 * @param calendarType
 */
export async function preferredCalendarTypeViewCookiesSet(
  calendarType: string
) {
  const cookieStore = cookies();
  cookieStore.set("preferredCalendarTypeView", calendarType, { path: "/" });
}
/**
 * 選択された月をクッキーに保存します
 * @param monthDate
 */
export async function preferredMonthlyShiftViewCookiesSet(monthDate: string) {
  const cookieStore = cookies();
  cookieStore.set("preferredMonthlyShiftView", monthDate, {
    path: "/",
  });
}
/**
 * 選択された半月をクッキーに保存します
 * @param halfMonthDate
 */
export async function preferredHalfMonthlyShiftViewCookiesSet(
  halfMonthDate: string
) {
  const cookieStore = cookies();
  cookieStore.set("preferredHalfMonthlyShiftView", halfMonthDate, {
    path: "/",
  });
}
/**
 * 選択された週をクッキーに保存します
 * @param weeklyDate
 */
export async function preferredWeeklyShiftViewCookiesSet(weeklyDate: string) {
  const cookieStore = cookies();
  cookieStore.set("preferredWeeklyShiftView", weeklyDate, {
    path: "/",
  });
}
/**
 * 選択された日をクッキーに保存します
 * @param DailyDate
 */
export async function preferredDailyShiftViewCookiesSet(DailyDate: string) {
  const cookieStore = cookies();
  cookieStore.set("preferredDailyShiftView", DailyDate, {
    path: "/",
  });
}
