"use server";
import { notFound, redirect } from "next/navigation";

export async function redirectCalenderType(
  calendarType: string,
  shiftStatus: string
) {
  console.log(calendarType, "はいあうう");
  //   try {
  redirect(`shift/${calendarType}/${shiftStatus}`);
  //   } catch {
  //     notFound();
  //   }
}

export async function redirectShiftStatus(
  viewProp: string,
  shiftStatus: string
) {
  console.log(`/shift/${viewProp}/${shiftStatus}`, "いくぜええええ");
  redirect(`/shift/${viewProp}/${shiftStatus}`);
}
