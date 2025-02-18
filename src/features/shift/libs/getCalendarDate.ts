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
  const dateStr = new Date(year, month, day).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo",
  });

  const dateParts = dateStr.split("/");
  return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
}

// 曜日を取得する関数
function getDayOfWeek(date: Date, weekdays: string[]): string {
  return `(${weekdays[date.getDay()]})`;
}

/**
 * 1ヶ月の日付データを返す関数
 * @param shiftStatus 202502
 * @returns
 */
export function getMonthlyDates(shiftStatus: string): {
  monthDays: { num: number; date: string; day: string }[];
  firstDate: string;
} {
  const year = parseInt(shiftStatus.slice(0, 4), 10);
  const monthIndex = parseInt(shiftStatus.slice(4, 6), 10) - 1;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDate = new Date(year, monthIndex, 1);

  const monthDays = generateDateRange(startDate, daysInMonth);
  const firstDate = monthDays[0] ? monthDays[0].date.split("-").join("") : "";

  return { monthDays, firstDate };
}

/**
 * 半月の日付データを返す関数
 * @param shiftStatus 202502/first 202502/second
 * @returns
 */
export function getHalfMonthlyDates(shiftStatus: string): {
  halfMonthDays: { num: number; date: string; day: string }[];
  firstDate: string;
} {
  const [month, period] = shiftStatus.split("/");
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

/**
 * 週の日付データを返す関数
 * @param shiftStatus 2025w01
 * @returns
 */
export function getWeeklyDates(shiftStatus: string): {
  weekDays: { num: number; date: string; day: string }[];
  firstDate: string;
} {
  const year = parseInt(shiftStatus.slice(0, 4), 10);
  const weekNumber = parseInt(shiftStatus.slice(5), 10);

  // その年の最初の木曜日を見つける
  const januaryFourth = new Date(year, 0, 4);
  const firstThursdayOfYear = new Date(
    januaryFourth.setDate(
      januaryFourth.getDate() - ((januaryFourth.getDay() + 4) % 7)
    )
  );

  // 週番号から週の最初の日付（日曜日）を計算
  const daysOffset = (weekNumber - 1) * 7;
  const firstDayOfWeek = new Date(
    firstThursdayOfYear.setDate(firstThursdayOfYear.getDate() + daysOffset)
  );
  firstDayOfWeek.setDate(
    firstDayOfWeek.getDate() - (firstDayOfWeek.getDay() % 7)
  );

  const weekDays = generateDateRange(firstDayOfWeek, 7);
  const firstDate = weekDays[0] ? weekDays[0].date.split("-").join("") : "";

  return { weekDays, firstDate };
}

/**
 * 1日の日付データを返す関数
 * @param shiftStatus 20250714
 * @returns
 */
export function getDailyDate(shiftStatus: string): {
  thisDate: { num: number; date: string; day: string }[];
  firstDate: string;
} {
  const year = parseInt(shiftStatus.slice(0, 4), 10);
  const monthIndex = parseInt(shiftStatus.slice(4, 6), 10) - 1;
  const day = parseInt(shiftStatus.slice(6, 8), 10);
  const targetDate = new Date(year, monthIndex, day);

  const thisDate = generateDateRange(targetDate, 1);
  const firstDate = thisDate[0] ? thisDate[0].date.split("-").join("") : "";

  return { thisDate, firstDate };
}
