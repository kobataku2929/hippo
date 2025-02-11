import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import {
  getViewTypes,
  getDefaultCalendarTypeView,
  getMonthStatus,
  getDefaultMonthlyShiftStatusView,
} from "@/features/shift/libs/settings";
import MonthCalendar from "@/app/shift/[...segments]/_components/MonthCalendar";
import HalfMonthCalendar from "@/app/shift/[...segments]/_components/HalfMonthCalendar";
import WeekCalendar from "@/app/shift/[...segments]/_components/WeekCalendar";
import DailyCalendar from "@/app/shift/[...segments]/_components/DailyCalendar";
import ChangeCalenderType from "@/app/shift/[...segments]/_components/ChangeCalenderType";
import { CalendarTypeView } from "@/features/shift/libs/settings";
import { getHalfMonthStatus } from "@/features/shift/libs/settings";
import {
  getMonthlyShiftStatus,
  getHalfMonthlyShiftStatus,
  getWeeklyShiftStatus,
  getDailyShiftStatus,
} from "@/features/shift/libs/getShiftStatus";
export default async function Shift({
  params,
}: {
  params: { segments: string[] };
}) {
  const calendarType = params.segments[0];
  let shiftDate = params.segments[1] ?? null;

  //要修正　これ共通多分できる
  if (!shiftDate && calendarType === "monthly") {
    shiftDate = getDefaultMonthlyShiftStatusView(shiftDate);
  }
  const viewTypes = getViewTypes();

  let viewProp: CalendarTypeView;

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  if (
    typeof calendarType === "string" &&
    viewTypes.includes(calendarType as CalendarTypeView)
  ) {
    viewProp = calendarType as CalendarTypeView;
  } else {
    const preferredSignInView: string | null =
      cookies().get("preferredCalendarTypeView")?.value || null;
    viewProp = getDefaultCalendarTypeView(
      preferredSignInView as CalendarTypeView
    );
    return redirect(`/shift/${viewProp}`);
  }

  //月カレンダーを選択した時にパスの違反をしていないか確認
  //要修正この条件分岐を変更
  if (calendarType === "monthly") {
    const monthPram = shiftDate.slice(-2);
    const monthStatus = getMonthStatus();
    if (!monthStatus.includes(monthPram) && viewProp === "monthly") {
      return notFound();
    }
  }
  console.log(getHalfMonthlyShiftStatus());
  console.log(getMonthlyShiftStatus());
  console.log(getWeeklyShiftStatus());
  console.log(getDailyShiftStatus());

  return (
    <div>
      <ChangeCalenderType />
      {viewProp === "monthly" && <MonthCalendar shiftDate={shiftDate} />}
      {viewProp === "halfmonthly" && <HalfMonthCalendar />}
      {viewProp === "weekly" && <WeekCalendar />}
      {viewProp === "daily" && <DailyCalendar shiftDate={shiftDate} />}
    </div>
  );
}
