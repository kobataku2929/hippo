// "use client";

import React from "react";
import { getAllDatesOfMonth } from "@/libs/calendar/getAllDatesOfYear";

const workers = [
  { id: 1, name: "小林ライオン", worktime: 2 },
  { id: 2, name: "宇都宮ベッカムうううううう", worktime: 2 },
  { id: 3, name: "竹島日本", worktime: 800 },
  { id: 4, name: "ちゃんアグネス", worktime: 40 },
];

function Calendar() {
  const today = new Date();
  const allDatesOfThisMonth = getAllDatesOfMonth(today);

  console.log(allDatesOfThisMonth);
  return (
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
        {allDatesOfThisMonth.map((monthdate) => (
          <div
            key={monthdate.date}
            className="w-12 text-xs p-1 border-solid border-t-2 border-r-2 border-indigo-300 bg-slate-300 pr-1"
          >
            {monthdate.num}
            {monthdate.day}
          </div>
        ))}
      </div>

      {/* 労働者の作業日数 */}
      <div className="absolute top-7 left-52">
        {workers.map((worker) => (
          <div key={worker.name} className="flex">
            {allDatesOfThisMonth.map((_, index) => (
              <div
                key={`${worker.id}-${index}`}
                className="flex justify-center items-center  text-xs border-solid border-b-2 border-r-2 h-10 w-12 "
              >
                <div className="bg-blue-200 w-10 h-8 rounded-sm">
                  {index + 1}7:00~
                  <br />
                  {worker.id}:00
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
