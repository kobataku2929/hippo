import React from "react";
import { getDay } from "@/features/shift/libs/getCalendarDate";

import { TimelineGrid } from "./TimelineGrid";
import { createClient } from "@/utils/supabase/server";

import { getDailyShifts } from "@/utils/supabase/queries";
import { addHyphensToDate } from "@/features/shift/libs/format";
import { changeDailyShiftStatus } from "@/features/shift/libs/changeShiftStatus";

type DailyCalendarProps = {
  shiftStatus: string;
};

const HOURS = 24;

const hours = Array.from(Array(HOURS));

async function DailyCalendar({ shiftStatus }: DailyCalendarProps) {
  const fromTime = addHyphensToDate(shiftStatus) + "T00:00:00";
  //todo ここプラス一する　propsにもハイフンが付けれられたものを渡す
  const toTime =
    addHyphensToDate(changeDailyShiftStatus("head", shiftStatus)) + "T00:00:00";

  const supabase = createClient();
  const dailyShifts = await getDailyShifts(supabase, fromTime, toTime);

  console.log(dailyShifts);

  if (!dailyShifts) {
    return <div>shiftdataからっすわ</div>;
  }
  return (
    <div className="w-auto pt-4 px-4 relative absolute top-8 left-4 right-4 bottom-0">
      <TimelineGuides />

      <div className="w-full flex justify-between ">
        {hours.map((_val, i) => (
          <TimelineHour
            key={i}
            hour={i}
            end={i + 1 === hours.length ? i + 1 : undefined}
          />
        ))}
      </div>

      <TimelineGrid dailyShifts={dailyShifts} shiftStatus={shiftStatus} />
    </div>
  );
}

const TimelineGuides = () => (
  <div className="w-auto flex justify-evenly  border-solid border-l border-r border-gray-300  absolute top-8 left-4 right-4 bottom-0">
    {Array.from(Array(hours.length - 1)).map((x, i) => (
      <span key={i} className="border-solid border-l border-gray-300"></span>
    ))}
  </div>
);

const TimelineHour = ({ hour, end }) => {
  return (
    <div className="relative w-full pt-4 ">
      <div className="text-xs absolute left-0 top-0 transform -translate-x-1/2">
        {hour}
      </div>
      <TimelineTicks />
      {end ? (
        <div className="text-xs absolute top-0 right-0 transform translate-x-1/2">
          {end}
        </div>
      ) : null}
    </div>
  );
};

const TimelineTicks = () => (
  <div className="flex justify-evenly w-full h-4">
    <span className="border-solid border-l border-gray-300"></span>
    <span className="border-solid border-l border-gray-300"></span>
    <span className="border-solid border-l border-gray-300"></span>
  </div>
);

export default DailyCalendar;
