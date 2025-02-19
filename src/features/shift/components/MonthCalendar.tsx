import React from "react";

type MonthCalendarProps = {
  shiftStatus: string;
};

function MonthCalendar({ shiftStatus }: MonthCalendarProps) {
  return (
    <div>
      <div>{shiftStatus}</div>
    </div>
  );
}

export default MonthCalendar;
