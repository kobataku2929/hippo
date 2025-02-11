/**
 * dateが指定されていない場合は今日の日付を使用
 * @param date 例"2024-12-15"
 * @returns
 */
function getDateObject(date = null) {
  return date ? new Date(date) : new Date();
}
const formatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * シフトの月のステータスを返します
 * @returns 例 202502
 */
export function getMonthlyShiftStatus(date = null) {
  const now = getDateObject(date);
  const formattedDate = formatter.format(now);
  const [year, month] = formattedDate.split("/");

  return `${year}${month}`;
}

/**
 *シフトの半月のステータスを返します
 * @returns 例 202502/first 202502/second
 */
export function getHalfMonthlyShiftStatus(date = null) {
  const now = getDateObject(date);
  const formattedDate = formatter.format(now);
  const [year, month, day] = formattedDate.split("/");
  const status = Number(day) <= 15 ? "first" : "second";

  return `${year}${month}/${status}`;
}
/**
 *シフトの週のステータスを返します
 * @returns 例 2025w01 2025w29
 */
export function getWeeklyShiftStatus(date = null) {
  const now = getDateObject(date);
  const japanTime = new Date(formatter.format(now));
  const year = japanTime.getFullYear();
  const startOfYear: Date = new Date(year, 0, 1);
  const dayOfYear =
    Math.ceil(
      (japanTime.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay()) / 7);
  //一桁の数字の前に0を追加
  const paddedWeekNumber = String(weekNumber).padStart(2, "0");

  return `${year}w${paddedWeekNumber}`;
}

/**
 *シフトの日のステータスを返します
 * @returns 例 20250714
 */
export function getDailyShiftStatus(date = null) {
  const now = getDateObject(date);
  const formattedDate = formatter.format(now);
  const dateWithoutSlashes = formattedDate.split("/").join("");

  return dateWithoutSlashes;
}
