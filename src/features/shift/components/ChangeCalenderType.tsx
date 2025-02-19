"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
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

type ChangeCalenderDateProps = {
  shiftStatus: string;
};

function ChangeCalenderType({
  shiftStatus,
  viewProp,
}: ChangeCalenderDateProps & { viewProp: CalendarTypeView }) {
  const searchParams = useSearchParams();
  const transitionsource = searchParams.get("transitionsource");

  async function changeCalenderType(newCalendarType: CalendarTypeView) {
    const transitionDate = getTransitionDate(
      transitionsource,
      viewProp,
      shiftStatus
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
