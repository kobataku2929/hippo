import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import {
  getViewTypes,
  getDefaultCalendarTypeView,
  getMonthStatus,
  getDefaultMonthlyShiftStatusView,
} from "@/features/shift/libs/settings";
import MonthCalendar from "@/features/shift/components/MonthCalendar";
import HalfMonthCalendar from "@/features/shift/components/HalfMonthCalendar";
import WeekCalendar from "@/features/shift/components/WeekCalendar";
import DailyCalendar from "@/features/shift/components/DailyCalendar";
import ChangeCalenderType from "@/features/shift/components/ChangeCalenderType";
import ChangeCalenderDate from "../../../features/shift/components/ChangeCalenderDate";
import { CalendarTypeView } from "@/features/shift/libs/settings";
import { createClient } from "@/utils/supabase/server";
import { getWorkers } from "@/utils/supabase/getQueries";
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
  let shiftStatus = params.segments.slice(1).join("/") ?? null;

  const supabase = createClient();
  const workers = await getWorkers(supabase, "堂山餃子チャオズ");
  console.log(workers);

  //TODO 要修正　これ共通多分できる
  if (!shiftStatus && calendarType === "monthly") {
    shiftStatus = getDefaultMonthlyShiftStatusView(shiftStatus);
  }
  const viewTypes = getViewTypes();

  let viewProp: CalendarTypeView;

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
    const monthPram = shiftStatus.slice(-2);
    const monthStatus = getMonthStatus();
    if (!monthStatus.includes(monthPram) && viewProp === "monthly") {
      return notFound();
    }
  }
  return (
    <div>
      <ChangeCalenderType viewProp={viewProp} shiftStatus={shiftStatus} />
      <ChangeCalenderDate viewProp={viewProp} shiftStatus={shiftStatus} />
      {viewProp === "monthly" && <MonthCalendar shiftStatus={shiftStatus} />}
      {viewProp === "halfmonthly" && <HalfMonthCalendar />}
      {viewProp === "weekly" && <WeekCalendar />}
      {viewProp === "daily" && (
        <DailyCalendar shiftStatus={shiftStatus} profiles={workers} />
      )}
    </div>
  );
}
