import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import {
  getViewTypes,
  getDefaultShiftTypeView,
  getMonthStatus,
  getDefaultShiftMonthStatusView,
} from "@/libs/shift/settings";
import MonthCalendar from "@/app/shift/[...segments]/_components/MonthCalendar";
import HalfMonthCalendar from "@/app/shift/[...segments]/_components/HalfMonthCalendar";
import WeekCalendar from "@/app/shift/[...segments]/_components/WeekCalendar";
import DailyCalendar from "@/app/shift/[...segments]/_components/DailyCalendar";
import ChangeCalenderType from "@/app/shift/[...segments]/_components/ChangeCalenderType";

import { ShiftTypeView } from "@/libs/shift/settings";

export default async function Shift({
  params,
}: {
  params: { segments: string[] };
}) {
  const shiftType = params.segments[0];
  let shiftDate = params.segments[1] ?? null;

  //要修正　これ共通多分できる
  if (!shiftDate && shiftType === "monthly") {
    shiftDate = getDefaultShiftMonthStatusView(shiftDate);
  }

  const viewTypes = getViewTypes();

  let viewProp: ShiftTypeView;

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  if (
    typeof shiftType === "string" &&
    viewTypes.includes(shiftType as ShiftTypeView)
  ) {
    viewProp = shiftType as ShiftTypeView;
  } else {
    const preferredSignInView: string | null =
      cookies().get("preferredShiftTypeView")?.value || null;
    viewProp = getDefaultShiftTypeView(preferredSignInView as ShiftTypeView);
    return redirect(`/shift/${viewProp}`);
  }

  //月カレンダーを選択した時にパスの違反をしていないか確認
  //要修正この条件分岐を変更
  if (shiftType === "monthly") {
    const monthPram = shiftDate.slice(-2);
    const monthStatus = getMonthStatus();
    if (!monthStatus.includes(monthPram) && viewProp === "monthly") {
      return notFound();
    }
  }

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = createClient();

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
