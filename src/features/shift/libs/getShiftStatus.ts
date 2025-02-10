//日本時間で統一 UTC+9時間を加算
const now: Date = new Date();

/**
 *シフトの月のステータスを返します
 * @returns 例 202502
 */
export function getMonthShiftStatus() {
  const japanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = japanTime.getFullYear();
  const month = String(japanTime.getMonth() + 1).padStart(2, "0");
  return `${year}${month}`;
}
/**
 *シフトの半月のステータスを返します
 * @returns 例 202502/first 202502/second
 */
export function getHalfMonthShiftStatus() {
  const japanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = japanTime.getFullYear();
  const month = String(japanTime.getMonth() + 1).padStart(2, "0");
  const day = japanTime.getDate();

  const status = day <= 15 ? "first" : "second";

  return `${year}${month}/${status}`;
}
/**
 *シフトの週のステータスを返します
 * @returns 例 2025w1 2025w29
 */
export function getWeekShiftStatus() {
  const japanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = japanTime.getFullYear();
  const startOfYear: Date = new Date(year, 0, 1);
  const dayOfYear =
    Math.ceil(
      (japanTime.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay()) / 7);
  return `${year}w${weekNumber}`;
}
/**
 *シフトの日のステータスを返します
 * @returns 例 20250714
 */
export function getDayShiftStatus() {
  const japanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = japanTime.getFullYear();
  const month = String(japanTime.getMonth() + 1).padStart(2, "0");
  const day = japanTime.getDate();

  return `${year}${month}${day}`;
}
