"use client";
import React from "react";
import { useParams } from "next/navigation";
import { preferredCalendarTypeViewCookiesSet } from "@/features/shift/libs/server";
import { redirectCalenderType } from "@/features/shift/libs/redirect";
import { CalendarTypeView } from "@/features/shift/libs/settings";
import {
  getMonthlyDates,
  getHalfMonthlyDates,
  getWeeklyDates,
  getDailyDate,
} from "@/features/shift/libs/getCalendarDate";

function ChangeCalenderType() {
  const { segments } = useParams();
  const calenderType = (segments as CalendarTypeView[])?.[0];
  const shiftStatus = (segments as string[])?.slice(1).join("/");

  console.log(getMonthlyDates("202501"));
  console.log(getHalfMonthlyDates("202501/second"));
  console.log(getWeeklyDates("2025W05"));
  console.log(getDailyDate("20250101"));

  async function changeCalenderType(calendarType: string) {
    const getDate = {
      monthly: getMonthlyDates,
      halfmonthly: "d",
      weekly: "v",
      daily: "Vv",
    };
    const firstDate = getDate[calenderType];
    if (!firstDate) return;

    console.log(calenderType, "うげ");
    // で新しいカレンダータイプ用のシフトステータスを作り引数に入れる
    //airshiftでは大→小の時は一番若い日にちを移行してる
    //小→大の時も同等　20250224日付単位
    //shiftstatusを変更する前後を押すとそのパラメーターはリセットされる
    // if(calendarType=)
    await redirectCalenderType(calendarType, "202309");
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
