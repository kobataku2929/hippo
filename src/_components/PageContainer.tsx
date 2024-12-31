import React from "react";
import Calendar from "../app/shift/[...segments]/_components/Calendar";
import AfterSignup from "../components/ui/AfterSignup";

import * as holiday_jp from "@holiday-jp/holiday_jp";

function PageContainer() {
  const holidays = holiday_jp.between(
    new Date("2024-5-1"),
    new Date("2024-5-30")
  );
  console.log(holidays);

  return (
    <div>
      PageContainer
      <Calendar />
      <AfterSignup />
    </div>
  );
}

export default PageContainer;
