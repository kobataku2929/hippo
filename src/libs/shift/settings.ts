export const viewTypes = ["monthly", "halfmonthly", "weekly", "daily"] as const;
export type ShiftTypeView = (typeof viewTypes)[number];

export function getViewTypes(): readonly ShiftTypeView[] {
  return viewTypes;
}

export function getDefaultShiftTypeView(
  preferredShiftTypeView: ShiftTypeView | null
): ShiftTypeView {
  const defaultShiftTypeView: ShiftTypeView = getViewTypes().includes(
    preferredShiftTypeView || "monthly"
  )
    ? preferredShiftTypeView || "monthly"
    : "monthly";

  return defaultShiftTypeView;
}

export function getMonthStatus() {
  return [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
}

export function getDefaultShiftMonthStatusView(
  preferredShiftMonthView: string | null
) {
  const now = new Date();
  const japanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9時間を加算
  const year = japanTime.getFullYear();
  const month = String(japanTime.getMonth() + 1).padStart(2, "0");
  const thisMonth = `${year}${month}`;

  const defaultShiftMonthStatusView = getMonthStatus().includes(
    (preferredShiftMonthView || "").slice(-2)
  )
    ? preferredShiftMonthView
    : thisMonth;

  return defaultShiftMonthStatusView;
}
