"use server";
import { notFound, redirect } from "next/navigation";

export async function redirectCalenderType(calendarType: string) {
  console.log(calendarType);
  //   try {
  redirect(`shift/${calendarType}`);
  //   } catch {
  //     notFound();
  //   }
}
