"use server";
import { notFound, redirect } from "next/navigation";

export async function redirectCalenderType(
  calendarType: string,
  shiftStatus: string,
  firstDate: string
) {
  const baseUrl = `/shift/${calendarType}/${shiftStatus}`;
  const url =
    calendarType === "daily"
      ? baseUrl
      : `${baseUrl}?transitionsource=${firstDate}`;

  redirect(url);

  //   try {

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
