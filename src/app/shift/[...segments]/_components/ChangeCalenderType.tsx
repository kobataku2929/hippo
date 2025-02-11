"use client";
import React from "react";
// import { useRouter } from "next/navigation";
import { preferredCalendarTypeViewCookiesSet } from "@/features/shift/libs/server";
import { redirectCalenderType } from "@/features/shift/libs/action";

function ChangeCalenderType() {
  // const router = useRouter();

  async function changeCalenderType(calendarType: string) {
    await preferredCalendarTypeViewCookiesSet(calendarType);
    redirectCalenderType(calendarType);
  }

  return (
    <div>
      {/* // パラメーターgetで取得してcalendarTypeと同じならボタン押せなくする */}
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
