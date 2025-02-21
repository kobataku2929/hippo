export function addHyphensToDate(dailyShiftStatus: string) {
  const year = dailyShiftStatus.slice(0, 4);
  const month = dailyShiftStatus.slice(4, 6);
  const day = dailyShiftStatus.slice(6, 8);

  return `${year}-${month}-${day}`;
}
