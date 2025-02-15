/**
 * 日付範囲の日付データを生成する関数
 * @param startDate 開始日
 * @param days 日数
 * @returns 日付データの配列
 */
function generateDateRange(
  startDate: Date,
  days: number
): { num: number; date: string; day: string }[] {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  return Array.from({ length: days }, (_, i) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    return {
      num: i + 1,
      date: formatDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ),
      day: getDayOfWeek(currentDate, weekdays),
    };
  });
}

// 日付をフォーマットする関数
function formatDate(year: number, month: number, day: number): string {
  return new Date(year, month, day)
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Tokyo",
    })
    .replace(/\//g, "-");
}

// 曜日を取得する関数
function getDayOfWeek(date: Date, weekdays: string[]): string {
  return `(${weekdays[date.getDay()]})`;
}

// 1ヶ月の日付データを返す関数
export function getMonthlyDates(month: string): {
  monthDays: { num: number; date: string; day: string }[];
  firstDate: string;
} {
  const year = parseInt(month.slice(0, 4), 10);
  const monthIndex = parseInt(month.slice(4, 6), 10) - 1;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDate = new Date(year, monthIndex, 1);

  const monthDays = generateDateRange(startDate, daysInMonth);
  const firstDate = monthDays[0] ? monthDays[0].date.split("-").join("") : "";

  return { monthDays, firstDate };
}

// 半月の日付データを返す関数
export function getHalfMonthlyDates(halfMonth: string): {
  halfMonthDays: { num: number; date: string; day: string }[];
  firstDate: string;
} {
  const [month, period] = halfMonth.split("/");
  const year = parseInt(month.slice(0, 4), 10);
  const monthIndex = parseInt(month.slice(4, 6), 10) - 1;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDay = period === "first" ? 1 : 16;
  const endDay = period === "first" ? 15 : daysInMonth;
  const startDate = new Date(year, monthIndex, startDay);

  const halfMonthDays = generateDateRange(startDate, endDay - startDay + 1);
  const firstDate = halfMonthDays[0]
    ? halfMonthDays[0].date.split("-").join("")
    : "";

  return { halfMonthDays, firstDate };
}

// 週の日付データを返す関数
export function getWeeklyDates(week: string): {
  weekDays: { num: number; date: string; day: string }[];
  firstDate: string;
} {
  const year = parseInt(week.slice(0, 4), 10);
  const weekNumber = parseInt(week.slice(5), 10);
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset = (weekNumber - 1) * 7;
  const firstDayOfWeek = new Date(
    firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset)
  );

  const weekDays = generateDateRange(firstDayOfWeek, 7);
  const firstDate = weekDays[0] ? weekDays[0].date.split("-").join("") : "";

  return { weekDays, firstDate };
}

// 1日の日付データを返す関数
export function getDailyDate(date: string): {
  dateInfo: { num: number; date: string; day: string };
} {
  const year = parseInt(date.slice(0, 4), 10);
  const monthIndex = parseInt(date.slice(4, 6), 10) - 1;
  const day = parseInt(date.slice(6, 8), 10);
  const targetDate = new Date(year, monthIndex, day);

  const dateInfo = generateDateRange(targetDate, 1)[0];

  return { dateInfo };
}
