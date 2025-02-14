"use client";
import React from "react";
import {
  changeMonthlytShiftStatus,
  changeHalfMonthlyShiftStatus,
  changeWeeklyShiftStatus,
  changeDailyShiftStatus,
} from "@/features/shift/libs/changeShiftStatus";
import { redirectShiftStatus } from "@/features/shift/libs/redirect";
import { preferredMonthlyShiftViewCookiesSet } from "@/features/shift/libs/server";
import { CalendarTypeView } from "@/features/shift/libs/settings";

type ChangeCalenderDateProps = {
  shiftStatus: string;
};

function ChangeCalenderDate({
  shiftStatus,
  viewProp,
}: ChangeCalenderDateProps & { viewProp: CalendarTypeView }) {
  function changeshiftStatus(status: string) {
    const shiftStatusFunctions = {
      monthly: changeMonthlytShiftStatus,
      halfmonthly: changeHalfMonthlyShiftStatus,
      weekly: changeWeeklyShiftStatus,
      daily: changeDailyShiftStatus,
    };

    const changeShiftFunction = shiftStatusFunctions[viewProp];

    if (!changeShiftFunction) return;

    const newShiftStatus = changeShiftFunction(status, shiftStatus);
    redirectShiftStatus(viewProp, newShiftStatus);

    // TODO: 修正が必要。クッキーに保存するとバグが発生する
    // preferredMonthlyShiftViewCookiesSet(newShiftStatus);
  }

  return (
    <div>
      <button
        onClick={() => changeshiftStatus("back")}
        className="bg-blue-100 m-1"
      >
        後ろ
      </button>
      <button onClick={() => changeshiftStatus("head")} className="bg-blue-100">
        前
      </button>
    </div>
  );
}

export default ChangeCalenderDate;
