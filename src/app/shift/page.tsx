import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  getDefaultShiftTypeView,
  getDefaultShiftMonthStatusView,
} from "@/libs/shift/settings";
import { ShiftTypeView } from "@/libs/shift/settings";

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
  }

  return redirect(`/shift/${defaultShiftTypeView}/${defaultStatus}`);
}
