import { create } from "zustand";
// import data from "./data";

function toMinutes(dateString) {
  const date = new Date(dateString);
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

const timeRangeToOffset = ({ from_time, to_time }) => {
  const xOffset = toMinutes(from_time) / 60;
  const length = (toMinutes(to_time) - toMinutes(from_time)) / 60;
  return { xOffset, length };
};

const entryToDisplayItem = (entries) => {
  const userToYOffsetMap = new Map();
  let yOffsetCounter = 0;

  return entries.map((obj) => {
    const { xOffset, length } = timeRangeToOffset(obj);

    if (!userToYOffsetMap.has(obj.user_id)) {
      userToYOffsetMap.set(obj.user_id, yOffsetCounter++);
    }

    return {
      id: obj.id,
      user: obj.user_id,
      workerName: obj.profiles.user_name,
      xOffset,
      yOffset: userToYOffsetMap.get(obj.user_id),
      length,
    };
  });
};
export const initializeStore = (data) =>
  create((set, get) => ({
    items: entryToDisplayItem(data),
    getItem: (findId) => get().items.find(({ id }) => id === findId),
    updateItem: (idToUpdate, yOffset, xOffset, length) => {
      set((state) => {
        const newItems = [...state.items];
        const item = newItems.find(({ id }) => idToUpdate === id);
        if (item) {
          item.xOffset = xOffset;
          item.yOffset = yOffset;
          item.length = length;
        }
        return { ...state, items: newItems };
      });
    },
  }));

//TODO TSにする際

// type Entry = {
//   id: string;
//   user_id: string;
//   profiles: {
//     user_name: string;
//   };
//   // timeRangeToOffset に渡すプロパティ（型を適宜調整）
//   start_time: string;
//   end_time: string;
// };

// type DisplayItem = {
//   id: string;
//   user: string;
//   worker: number;
//   workerName: string;
//   xOffset: number;
//   length: number;
// };

// const entryToDisplayItem = (entries: Entry[]): DisplayItem[] => {
//   const userToWorkerMap = new Map<string, number>();
//   let workerCounter = 0;

//   return entries.map((obj) => {
//     const { xOffset, length } = timeRangeToOffset(obj);

//     if (!userToWorkerMap.has(obj.user_id)) {
//       userToWorkerMap.set(obj.user_id, workerCounter++);
//     }

//     return {
//       id: obj.id,
//       user: obj.user_id,
//       worker: userToWorkerMap.get(obj.user_id) as number, // Map にあることが保証されているので `as number` を使用
//       workerName: obj.profiles.user_name,
//       xOffset,
//       length,
//     };
//   });
// };
