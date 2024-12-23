"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { preferredShiftTypeViewCookiesSet } from "@/libs/shift/server";

function ChangeCalenderType() {
  const router = useRouter();

  async function changeCalenderType(calendarType: string) {
    await preferredShiftTypeViewCookiesSet(calendarType);
    router.push(calendarType);
  }

  return (
    <div>
      <button onClick={() => changeCalenderType("monthly")}>月</button>
      <button onClick={() => changeCalenderType("halfmonthly")}>半月</button>
      <button onClick={() => changeCalenderType("weekly")}>週</button>
      <button onClick={() => changeCalenderType("daily")}>日</button>
    </div>
  );
}

export default ChangeCalenderType;
