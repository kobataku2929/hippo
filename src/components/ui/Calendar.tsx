"use client";

import React, { useState } from "react";
import MonthCalendar from "./MonthCalendar";
import HalfMonthCalendar from "./HalfMonthCalendar";
import WeekCalendar from "./WeekCalendar";

function Calendar() {
  const [calendarState, setCalendarState] = useState({
    month: true,
    halfmonth: false,
    week: false,
  });

  function changeCalenderType(calendarType: string) {
    setCalendarState({
      month: false,
      halfmonth: false,
      week: false,
      [calendarType]: true,
    });
  }

  return (
    <div>
      <button onClick={() => changeCalenderType("day")}>日</button>
      <button onClick={() => changeCalenderType("week")}>週</button>
      <button onClick={() => changeCalenderType("halfmonth")}>半月</button>
      <button onClick={() => changeCalenderType("month")}>月</button>
      {calendarState.month && <MonthCalendar />}
      {calendarState.halfmonth && <HalfMonthCalendar />}
      {calendarState.week && <WeekCalendar />}
    </div>
  );
}

export default Calendar;
