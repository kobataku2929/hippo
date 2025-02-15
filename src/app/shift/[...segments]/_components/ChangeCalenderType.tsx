"use client";
import React from "react";
import { useParams } from "next/navigation";
import { preferredCalendarTypeViewCookiesSet } from "@/features/shift/libs/server";
import { redirectCalenderType } from "@/features/shift/libs/redirect";
import { CalendarTypeView } from "@/features/shift/libs/settings";
import { addHyphensToDate } from "@/features/shift/libs/format";
import {
  getMonthlyDates,
  getHalfMonthlyDates,
  getWeeklyDates,
  getDailyDate,
} from "@/features/shift/libs/getCalendarDate";

import {
  getMonthlyShiftStatus,
  getHalfMonthlyShiftStatus,
  getWeeklyShiftStatus,
} from "@/features/shift/libs/getShiftStatus";

function ChangeCalenderType() {
  const { segments } = useParams();
  const calenderType = (segments as CalendarTypeView[])?.[0];
  const shiftStatus = (segments as string[])?.slice(1).join("/");

  // console.log(getMonthlyDates("202501"));
  // console.log(getHalfMonthlyDates("202502/first"));
  // console.log(getWeeklyDates("2025W07"));
  // console.log(getDailyDate("20250101"));
  // console.log(shiftStatus, "まじすっか");

  console.log(getMonthlyShiftStatus("2025-02-15"));
  console.log(getHalfMonthlyShiftStatus("2025-02-15"));
  console.log(getWeeklyShiftStatus("2025-02-15"));

  async function changeCalenderType(calendarType: string) {
    const getDate = {
      monthly: getMonthlyDates,
      halfmonthly: getHalfMonthlyDates,
      weekly: getWeeklyDates,
      daily: getDailyDate,
    };
    const getDates = getDate[calenderType];
    const { firstDate } = getDates(shiftStatus);

    const newShiftStatus = {
      monthly: getMonthlyShiftStatus(addHyphensToDate(firstDate)),
      halfmonthly: getHalfMonthlyShiftStatus(addHyphensToDate(firstDate)),
      weekly: getWeeklyShiftStatus(addHyphensToDate(firstDate)),
      daily: firstDate,
    };

    // if (!getDates) return;

    // で新しいカレンダータイプ用のシフトステータスを作り引数に入れる
    //airshiftでは大→小の時は一番若い日にちを移行してる
    //小→大の時も同等　20250224日付単位
    //shiftstatusを変更する前後を押すとそのパラメーターはリセットされる
    // if(calendarType=)
    await redirectCalenderType(
      calendarType,
      newShiftStatus[calenderType],
      firstDate
    );
    preferredCalendarTypeViewCookiesSet(calendarType);
  }

  return (
    <div>
      {/* TODO パラメーターgetで取得してcalendarTypeと同じならボタン押せなくする */}
      <button onClick={() => changeCalenderType("monthly")}>月</button>
      <button onClick={() => changeCalenderType("halfmonthly")}>半月</button>
      <button onClick={() => changeCalenderType("weekly")}>週</button>
      <button onClick={() => changeCalenderType("daily")}>日</button>
    </div>
  );
}

export default ChangeCalenderType;
