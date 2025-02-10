import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  getDefaultShiftTypeView,
  getDefaultShiftMonthStatusView,
  getDefaultShiftHalfMonthStatusView,
  getDefaultShiftWeekStatusView,
  getDefaultShiftDayStatusView,
} from "@/features/shift/libs/settings";
import { ShiftTypeView } from "@/features/shift/libs/settings";

export default function Shift() {
  const preferredShiftTypeView =
    cookies().get("preferredShiftTypeView")?.value || null;
  const defaultShiftTypeView = getDefaultShiftTypeView(
    preferredShiftTypeView as ShiftTypeView
  );

  let defaultStatus;

  if (defaultShiftTypeView === "monthly") {
    const preferredShiftMonthView =
      cookies().get("preferredShiftMonthView")?.value || null;
    defaultStatus = getDefaultShiftMonthStatusView(preferredShiftMonthView);
  } else if (defaultShiftTypeView === "halfmonthly") {
    const preferredShiftHalfMonthView =
      cookies().get("preferredShiftHalfMonthView")?.value || null;
    defaultStatus = getDefaultShiftHalfMonthStatusView(
      preferredShiftHalfMonthView
    );
  } else if (defaultShiftTypeView === "weekly") {
    const preferredShiftWeekView =
      cookies().get("preferredShiftWeekView")?.value || null;
    defaultStatus = getDefaultShiftWeekStatusView(preferredShiftWeekView);
  } else if (defaultShiftTypeView === "daily") {
    const preferredShiftDayView =
      cookies().get("preferredShiftDayView")?.value || null;
    defaultStatus = getDefaultShiftDayStatusView(preferredShiftDayView);
  }

  return redirect(`/shift/${defaultShiftTypeView}/${defaultStatus}`);
}
