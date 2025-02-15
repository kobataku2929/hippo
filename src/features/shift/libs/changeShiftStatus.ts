/**
 * 月のシフトのステータスを変更します
 * @param status
 * @param shiftStatus
 */
export function changeMonthlytShiftStatus(status: string, shiftStatus: string) {
  let year: string = shiftStatus.slice(0, 4);
  let month: number = parseInt(shiftStatus.slice(4), 10);

  if (status === "back") {
    month -= 1;
  } else if (status === "head") {
    month += 1;
  }

  if (month === 0) {
    month = 12;
    year = (parseInt(year, 10) - 1).toString();
  } else if (month === 13) {
    month = 1;
    year = (parseInt(year, 10) + 1).toString();
  }
  console.log(shiftStatus, status, month);
  // 新しい URL パスを構築
  return `${year}${String(month).padStart(2, "0")}`;
}

/**
 * 半月のシフトのステータスを変更します
 * @param status
 * @param shiftStatus
 * @returns
 */
export function changeHalfMonthlyShiftStatus(
  status: string,
  shiftStatus: string
) {
  const [yearMonth, initialPreferredDividedMonth] = shiftStatus.split("/");
  let year: number = parseInt(yearMonth.slice(0, 4), 10);
  let month: number = parseInt(yearMonth.slice(4), 10);
  let preferredDividedMonth = initialPreferredDividedMonth;

  if (status === "back") {
    if (preferredDividedMonth === "first") {
      month -= 1;
      preferredDividedMonth = "second";
    } else if (preferredDividedMonth === "second") {
      preferredDividedMonth = "first";
    }
  } else if (status === "head") {
    if (preferredDividedMonth === "second") {
      month += 1;
      preferredDividedMonth = "first";
    } else if (preferredDividedMonth === "first") {
      preferredDividedMonth = "second";
    }
  }

  if (month === 0) {
    month = 12;
    year -= 1;
  } else if (month === 13) {
    month = 1;
    year += 1;
  }

  const newYearMonth = `${year}${month.toString().padStart(2, "0")}`;

  return `${newYearMonth}/${preferredDividedMonth}`;
}

/**
 * 週のシフトのステータスを変更します
 * @param status
 * @param shiftStatus
 *
 */
export function changeWeeklyShiftStatus(status: string, shiftStatus: string) {
  let year: number = parseInt(shiftStatus.slice(0, 4), 10); // 年を数値で取得
  let week: number = parseInt(shiftStatus.slice(5), 10); // 週を数値で取得

  // status に応じて週を更新
  if (status === "back") {
    week -= 1;
  } else if (status === "head") {
    week += 1;
  }

  // その年の最終週を取得
  const lastWeek = getLastWeekOfYear(year);

  // 年を超える場合
  if (week > lastWeek) {
    year += 1; // 年を増やす
    week = 1; // 新年の最初の週にリセット
  } else if (week < 1) {
    // 前の年に戻る場合
    year -= 1; // 年を減らす
    week = getLastWeekOfYear(year); // 前の年の最終週を取得
  }
  const paddedWeekNumber = week.toString().padStart(2, "0");
  return `${year}w${paddedWeekNumber}`;
}

// 与えられた年の最終週番号を計算（ISO 8601 に準拠）
function getLastWeekOfYear(year: number): number {
  const date = new Date(year, 11, 31); // その年の12月31日
  const day = date.getDay();
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  // ISO 8601のルールで最終週が52か53かを判定
  if (day === 4 || (day === 3 && isLeapYear)) {
    return 53; // 最終週が53週になる場合
  }
  return 52; // 通常の52週
}
/**
 *
 * @param status
 * @param shiftStatus
 * @returns
 */
export function changeDailyShiftStatus(status: string, shiftStatus: string) {
  // 年、月、日を抽出し、Dateオブジェクトを生成
  const year = parseInt(shiftStatus.slice(0, 4), 10);
  const month = parseInt(shiftStatus.slice(4, 6), 10) - 1; // JavaScriptの月は0始まり
  const day = parseInt(shiftStatus.slice(6, 8), 10);
  const date = new Date(year, month, day);

  // 日付を加減
  if (status === "back") {
    date.setDate(date.getDate() - 1); // 前の日
  } else if (status === "head") {
    date.setDate(date.getDate() + 1); // 次の日
  }

  // 年、月、日をフォーマット
  const newYear = date.getFullYear();
  const newMonth = (date.getMonth() + 1).toString().padStart(2, "0"); // 1始まりに調整
  const newDay = date.getDate().toString().padStart(2, "0");

  const newshiftStatus = `${newYear}${newMonth}${newDay}`;

  return newshiftStatus;
}
