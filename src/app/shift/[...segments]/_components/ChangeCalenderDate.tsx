"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { preferredShiftMonthViewCookiesSet } from "@/features/shift/libs/server";

type ChangeCalenderDateProps = {
  shiftDate: string;
};

function ChangeCalenderDate({ shiftDate }: ChangeCalenderDateProps) {
  const router = useRouter();

  function changeShiftDate(status: string) {
    let year: string = shiftDate.slice(0, 4);
    let month: number = parseInt(shiftDate.slice(4), 10);

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

    // 新しい URL パスを構築
    const newShiftDate = `${year}${String(month).padStart(2, "0")}`;
    const newPath = `/shift/monthly/${newShiftDate}`;
    preferredShiftMonthViewCookiesSet(newShiftDate);

    router.push(newPath);
  }
  return (
    <div>
      <button
        onClick={() => changeShiftDate("back")}
        className="bg-blue-100 m-1"
      >
        後ろ
      </button>
      <button onClick={() => changeShiftDate("head")} className="bg-blue-100">
        前
      </button>
    </div>
  );
}

export default ChangeCalenderDate;
