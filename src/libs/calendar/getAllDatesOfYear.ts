//要修正　使う先で一度しか取得しないようにキャッシュする　年が変わったタイミングでrevalidate
export function getAllDatesOfYear(year: number): string[] {
  const dates: string[] = [];
  const date = new Date(year, 0, 1); // 年の初日を作成

  // 1月1日から12月31日までループ
  while (date.getFullYear() === year) {
    // 日付をYYYY-MM-DD形式で追加
    dates.push(
      date
        .toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-")
    );
    date.setDate(date.getDate() + 1); // 1日進める
  }

  return dates;
}

export function getAllDatesOfMonth(
  date: Date
): { num: number; date: string; day: string }[] {
  const dates: { num: number; date: string; day: string }[] = [];
  const year = date.getFullYear();
  const month = date.getMonth(); // 月（0-basedなので1月は0）
  const firstDayOfMonth = new Date(year, month, 1); // その月の1日
  const lastDayOfMonth = new Date(year, month + 1, 0); // その月の最終日

  // 曜日配列
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  let counter = 1; // 番号付け用のカウンタ

  // その月の1日から最終日までループ
  while (firstDayOfMonth <= lastDayOfMonth) {
    const weekday = weekdays[firstDayOfMonth.getDay()]; // 曜日を取得

    // 番号、日付、曜日をオブジェクトとして追加
    dates.push({
      num: counter,
      date: firstDayOfMonth
        .toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-"),
      day: `(${weekday})`,
    });

    counter++; // 番号を1増やす
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1); // 1日進める
  }

  return dates;
}

const today = new Date();
const allDatesOfThisMonth = getAllDatesOfMonth(today);

// 結果を表示（YYYY-MM-DD形式）
allDatesOfThisMonth.forEach((date) => {
  console.log(date);
});

// 結果を表示（YYYY-MM-DD形式）
// allDates2028.forEach((date) => {
//   console.log(date);
// });
