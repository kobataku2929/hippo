"use client";

import React from "react";
import { getDay } from "@/libs/calendar/getAllDatesOfYear";
import { TimelineGrid } from "./TimelineGrid";

const workers = [
  { id: 1, name: "小林ライオン", worktime: 2 },
  { id: 2, name: "宇都宮ベッカムうううううう", worktime: 2 },
  { id: 3, name: "竹島日本", worktime: 800 },
  { id: 4, name: "ちゃんアグネス", worktime: 40 },
];
type DailyCalendarProps = {
  shiftDate: string;
};

function DailyCalendar({ shiftDate }: DailyCalendarProps) {
  const today = getDay("20241201");

  return (
    <div>
      <div>日カレンダーです</div>
      <div className="relative">
        {/* 労働時間ヘッダー */}
        <div className="grid grid-cols-2 w-52 text-xs">
          <div className="col-start-2 whitespace-nowrap border-solid border-t-2 border-l-2 border-r-2 h-7">
            労働時間
          </div>
          {workers.map((worker, index) => (
            <>
              <div
                key={`name-${index}`}
                className="truncate border-solid border-t-2 border-l-2 h-10"
              >
                {worker.name}
              </div>
              <div
                key={`worktime-${index}`}
                className="border-solid border-t-2  border-l-2 border-r-2 h-10"
              >
                {worker.worktime}時間
              </div>
            </>
          ))}
        </div>

        {/* 月の日付ヘッダー */}
        <div className="absolute top-0 left-52 flex h-7">
          {today.map((time, index) => (
            <div
              key={index}
              className="w-3 text-xs p-1 border-solid border-t-2 border-r-2 border-indigo-300 bg-slate-300 pr-1"
            >
              {time.hour}
            </div>
          ))}
        </div>

        {/* 労働者の作業日数 */}
        <div className="absolute top-7 left-52">
          {workers.map((worker) => (
            <div key={worker.name} className="flex">
              {today.map((_, index) => (
                <div
                  key={`${worker.id}-${index}`}
                  className="flex justify-center items-center  text-xs border-solid border-b border-r border-indigo-200 h-10 w-3 "
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Timeline />
    </div>
  );
}

const HOURS = 24;

const hours = Array.from(Array(HOURS));

const Timeline = () => {
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

      <TimelineGrid />
    </div>
  );
};

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
