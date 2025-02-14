import {
  getMonthlyShiftStatus,
  getHalfMonthlyShiftStatus,
  getWeeklyShiftStatus,
  getDailyShiftStatus,
} from "./getShiftStatus";
export const viewTypes = ["monthly", "halfmonthly", "weekly", "daily"] as const;
export type CalendarTypeView = (typeof viewTypes)[number];

export function getViewTypes(): readonly CalendarTypeView[] {
  return viewTypes;
}

export function getDefaultCalendarTypeView(
  preferredCalendarTypeView: CalendarTypeView | null
): CalendarTypeView {
  const defaultCalendarTypeView: CalendarTypeView = getViewTypes().includes(
    preferredCalendarTypeView || "monthly"
  )
    ? preferredCalendarTypeView || "monthly"
    : "monthly";

  return defaultCalendarTypeView;
}

function generateDateArray(num: number) {
  const dateList = Array(num)
    .fill(0)
    .map((_, i) => {
      const date = i + 1;
      return date < 10 ? `0${date}` : `${date}`;
    });
  return dateList;
}

export function getMonthStatus() {
  return generateDateArray(12);
}

export function getHalfMonthStatus() {
  return ["first", "secound"];
}

export function isWeekStatus(v: string) {
  return v[4] === "w";
}

export function getDayStatus() {
  return generateDateArray(31);
}

//デフォルトのパス設定
/**
 * 月単位のデフォルトのパスを返します
 * @param preferredMonthlyShiftView
 * @returns 例 202503
 */
export function getDefaultMonthlyShiftStatusView(
  preferredMonthlyShiftView: string | null
) {
  const thisMonth = getMonthlyShiftStatus();

  const defaultMonthlyShiftStatusView = getMonthStatus().includes(
    (preferredMonthlyShiftView ?? "").slice(-2)
  )
    ? preferredMonthlyShiftView
    : thisMonth;

  return defaultMonthlyShiftStatusView;
}

/**
 * 半月単位のデフォルトのパスを返します
 * @param preferredHalfMonthlyShiftView
 * @returns 例 202502/first
 */
export function getDefaultHalfMonthlyShiftStatusView(
  preferredHalfMonthlyShiftView: string | null
) {
  const thisHalfMonth = getHalfMonthlyShiftStatus();
  //要修正　[]の形で格納する
  const preferredHalfMonth = (preferredHalfMonthlyShiftView ?? "").split("/");
  const preferredMonth = preferredHalfMonth[0]; // "202502"
  const preferredDividedMonth = preferredHalfMonth[1]; // "first"

  const defaultHalfMonthlyShiftStatusView =
    getMonthStatus().includes(preferredMonth.slice(-2)) &&
    getHalfMonthStatus().includes(preferredDividedMonth)
      ? preferredHalfMonthlyShiftView
      : thisHalfMonth;

  return defaultHalfMonthlyShiftStatusView;
}

/**
 * 週単位のデフォルトのパスを返します
 * @param preferredWeeklyShiftView
 * @returns 例 2025w1
 */
export function getDefaultWeeklyShiftStatusView(
  preferredWeeklyShiftView: string | null
) {
  const thisWeek = getWeeklyShiftStatus();
  const defaultWeeklyShiftStatusView = isWeekStatus(
    preferredWeeklyShiftView ?? ""
  )
    ? preferredWeeklyShiftView
    : thisWeek;

  return defaultWeeklyShiftStatusView;
}

/**
 * 日単位のデフォルトのパスを返します
 * @param preferredDailyShiftView
 * @returns 例 20250714
 */
export function getDefaultDailyShiftStatusView(
  preferredDailyShiftView: string | null
) {
  const today = getDailyShiftStatus();
  const preferredMonth = (preferredDailyShiftView ?? "").slice(4, 6);
  const preferredDay = (preferredDailyShiftView ?? "").slice(6, 8);
  const defaultMonthlyShiftStatusView =
    getMonthStatus().includes(preferredMonth.slice(-2)) &&
    getDayStatus().includes(preferredDay)
      ? preferredDailyShiftView
      : today;

  return defaultMonthlyShiftStatusView;
}
