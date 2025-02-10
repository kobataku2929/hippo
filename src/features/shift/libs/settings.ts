import { getMonthShiftStatus } from "./getShiftStatus";
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

//デフォルトのパス設定
/**
 *
 * @param preferredShiftMonthView
 * @returns 例 202503
 */
export function getDefaultShiftMonthStatusView(
  preferredShiftMonthView: string | null
) {
  const thisMonth = getMonthShiftStatus();

  const defaultShiftMonthStatusView = getMonthStatus().includes(
    (preferredShiftMonthView || "").slice(-2)
  )
    ? preferredShiftMonthView
    : thisMonth;

  return defaultShiftMonthStatusView;
}

/**
 *
 * @param preferredShiftMonthView
 * @returns 例 202503
 */
export function getDefaultShiftHalfMonthStatusView(
  preferredShiftMonthView: string | null
) {
  const thisMonth = getMonthShiftStatus();

  const defaultShiftMonthStatusView = getMonthStatus().includes(
    (preferredShiftMonthView || "").slice(-2)
  )
    ? preferredShiftMonthView
    : thisMonth;

  return defaultShiftMonthStatusView;
}

/**
 *
 * @param preferredShiftMonthView
 * @returns 例 202503
 */
export function getDefaultShiftWeekStatusView(
  preferredShiftMonthView: string | null
) {
  const thisMonth = getMonthShiftStatus();

  const defaultShiftMonthStatusView = getMonthStatus().includes(
    (preferredShiftMonthView || "").slice(-2)
  )
    ? preferredShiftMonthView
    : thisMonth;

  return defaultShiftMonthStatusView;
}

/**
 *
 * @param preferredShiftMonthView
 * @returns 例 202503
 */
export function getDefaultShiftDayStatusView(
  preferredShiftMonthView: string | null
) {
  const thisMonth = getMonthShiftStatus();

  const defaultShiftMonthStatusView = getMonthStatus().includes(
    (preferredShiftMonthView || "").slice(-2)
  )
    ? preferredShiftMonthView
    : thisMonth;

  return defaultShiftMonthStatusView;
}
