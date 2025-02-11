import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  getDefaultCalendarTypeView,
  getDefaultMonthlyShiftStatusView,
  getDefaultHalfMonthlyShiftStatusView,
  getDefaultWeeklyShiftStatusView,
  getDefaultDailyShiftStatusView,
} from "@/features/shift/libs/settings";
import { CalendarTypeView } from "@/features/shift/libs/settings";

export default function Shift() {
  const preferredCalendarTypeView =
    cookies().get("preferredCalendarTypeView")?.value || null;
  const defaultCalendarTypeView = getDefaultCalendarTypeView(
    preferredCalendarTypeView as CalendarTypeView
  );

  let defaultShiftStatus;

  //要相談　これ早期リターンの方が見やすい？
  if (defaultCalendarTypeView === "monthly") {
    const preferredMonthlyShiftView =
      cookies().get("preferredMonthlyShiftView")?.value || null;
    defaultShiftStatus = getDefaultMonthlyShiftStatusView(
      preferredMonthlyShiftView
    );
  } else if (defaultCalendarTypeView === "halfmonthly") {
    const preferredHalfMonthlyShiftView =
      cookies().get("preferredHalfMonthlyShiftView")?.value || null;
    defaultShiftStatus = getDefaultHalfMonthlyShiftStatusView(
      preferredHalfMonthlyShiftView
    );
  } else if (defaultCalendarTypeView === "weekly") {
    const preferredWeeklyShiftView =
      cookies().get("preferredWeeklyShiftView")?.value || null;
    defaultShiftStatus = getDefaultWeeklyShiftStatusView(
      preferredWeeklyShiftView
    );
  } else if (defaultCalendarTypeView === "daily") {
    const preferredDailyShiftView =
      cookies().get("preferredDailyShiftView")?.value || null;
    defaultShiftStatus = getDefaultDailyShiftStatusView(
      preferredDailyShiftView
    );
  }

  return redirect(`/shift/${defaultCalendarTypeView}/${defaultShiftStatus}`);
}
