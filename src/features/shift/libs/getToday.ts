/**
 * ISO 8601の形式で今日を返します
 * 出力例: 2025-02-09T15:30:45+09:00
 */
export function getToday() {
  const today = new Date();

  // 日本時間（UTC+9）で各要素を取得
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 月（0始まりなので+1）
  const day = String(today.getDate()).padStart(2, "0"); // 日
  const hours = String(today.getHours()).padStart(2, "0"); // 時間
  const minutes = String(today.getMinutes()).padStart(2, "0"); // 分
  const seconds = String(today.getSeconds()).padStart(2, "0"); // 秒

  // フォーマットを組み立て
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`;
}
