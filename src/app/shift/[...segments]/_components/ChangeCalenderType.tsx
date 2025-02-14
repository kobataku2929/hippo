"use client";
import React from "react";
import { useParams } from "next/navigation";
import { preferredCalendarTypeViewCookiesSet } from "@/features/shift/libs/server";
import { redirectCalenderType } from "@/features/shift/libs/redirect";

function ChangeCalenderType() {
  const { segments } = useParams();
  const calenderType = (segments as string[])?.[0];
  const shiftStatus = (segments as string[])?.slice(1).join("/");

  async function changeCalenderType(calendarType: string) {
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
      {/* //要修正 パラメーターgetで取得してcalendarTypeと同じならボタン押せなくする */}
      <button onClick={() => changeCalenderType("monthly")}>月</button>
      <button onClick={() => changeCalenderType("halfmonthly")}>半月</button>
      <button onClick={() => changeCalenderType("weekly")}>週</button>
      <button onClick={() => changeCalenderType("daily")}>日</button>
    </div>
  );
}

export default ChangeCalenderType;

// 'use client'

// import { navigate } from './actions'

// export function ClientRedirect() {
//   return (
//     <form action={navigate}>
//       <input type="text" name="id" />
//       <button>Submit</button>
//     </form>
//   )
// }

// 'use server'

// import { redirect } from 'next/navigation'

// export async function navigate(data: FormData) {
//   redirect(`/posts/${data.get('id')}`)
