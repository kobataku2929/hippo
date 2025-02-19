"use server";
import { redirect } from "next/navigation";

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
}

export async function redirectShiftStatus(
  viewProp: string,
  shiftStatus: string
) {
  redirect(`/shift/${viewProp}/${shiftStatus}`);
}
