"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { preferredCalendarTypeViewCookiesSet } from "@/features/shift/libs/setCookies";
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
  const nowCalenderType = (segments as CalendarTypeView[])?.[0];
  const nowShiftStatus = (segments as string[])?.slice(1).join("/");
  const searchParams = useSearchParams();
  const transitionsource = searchParams.get("transitionsource");

  // console.log(getMonthlyDates("202501"));
  // console.log(getHalfMonthlyDates("202502/first"));
  // console.log(getWeeklyDates("2025W01"));
  // console.log(getDailyDate("20250101"));
  // console.log(shiftStatus, "まじすっか");

  // console.log(getMonthlyShiftStatus("2025-02-15"));
  // console.log(getHalfMonthlyShiftStatus("2025-02-15"));
  // console.log(getWeeklyShiftStatus("2025-02-15"));
  // console.log(transitionsource, "hフィ絵shフィエhふぃえお");

  async function changeCalenderType(newCalendarType: CalendarTypeView) {
    const transitionDate = getTransitionDate(
      transitionsource,
      nowCalenderType,
      nowShiftStatus
    );

    const newShiftStatus = {
      monthly: getMonthlyShiftStatus(addHyphensToDate(transitionDate)),
      halfmonthly: getHalfMonthlyShiftStatus(addHyphensToDate(transitionDate)),
      weekly: getWeeklyShiftStatus(addHyphensToDate(transitionDate)),
      daily: transitionDate,
    };

    await preferredCalendarTypeViewCookiesSet(newCalendarType);
    redirectCalenderType(
      newCalendarType,
      newShiftStatus[newCalendarType],
      transitionDate
    );
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

// TODO 相談 このコンポーネントでしか使わない関数はファイルを切り分けないでもいい？
function getTransitionDate(
  transitionsource: string | null,
  nowCalenderType: CalendarTypeView,
  nowShiftStatus: string
) {
  if (transitionsource) {
    return transitionsource;
  } else {
    const dateGetters = {
      monthly: getMonthlyDates,
      halfmonthly: getHalfMonthlyDates,
      weekly: getWeeklyDates,
      daily: getDailyDate,
    };
    const getDatesFunction = dateGetters[nowCalenderType];
    const { firstDate } = getDatesFunction(nowShiftStatus);
    return firstDate;
  }
}
