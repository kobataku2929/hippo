import { create } from "zustand";
import data from "./data";

function toMinutes(dateString) {
  const date = new Date(dateString);
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

const timeRangeToOffset = ({ from_time, to_time }) => {
  const xOffset = toMinutes(from_time) / 60;
  const length = (toMinutes(to_time) - toMinutes(from_time)) / 60;
  return { xOffset, length };
};

const entryToDisplayItem = (obj, index) => {
  const { xOffset, length } = timeRangeToOffset(obj);

  return {
    id: obj.id,
    worker: index,
    workerName: obj.profiles.user_name,
    xOffset,
    length,
  };
};
// export const useStore = create((set, get) => ({
//   items: data.map(entryToDisplayItem),
//   getItem: (findId) => get().items.find(({ id }) => id === findId),
//   updateItem: (idToUpdate, worker, xOffset, length) => {
//     set((state) => {
//       const newItems = [...state.items];

//       const item = newItems.find(({ id }) => idToUpdate === id);
//       item.xOffset = xOffset;
//       item.length = length;
//       item.worker = worker;

//       return {
//         ...state,
//         items: newItems,
//       };
//     });
//   },
// }));
export const initializeStore = (data) =>
  create((set, get) => ({
    items: data.map(entryToDisplayItem),
    getItem: (findId) => get().items.find(({ id }) => id === findId),
    updateItem: (idToUpdate, worker, xOffset, length) => {
      set((state) => {
        const newItems = [...state.items];
        const item = newItems.find(({ id }) => idToUpdate === id);
        if (item) {
          item.xOffset = xOffset;
          item.length = length;
          item.worker = worker;
        }
        return { ...state, items: newItems };
      });
    },
  }));
