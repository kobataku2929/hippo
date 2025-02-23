import { create } from "zustand";
import { createUserYOffsetMaps } from "../utils/dragAndDropUtils";

function toMinutes(dateString) {
  const date = new Date(dateString);
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

const timeRangeToOffset = ({ from_time, to_time }) => {
  const xOffset = toMinutes(from_time) / 60;
  const length = (toMinutes(to_time) - toMinutes(from_time)) / 60;
  return { xOffset, length };
};

const entryToDisplayItem = (dailyShifts, workers) => {
  const { userToYOffsetMap } = createUserYOffsetMaps(workers);

  return dailyShifts.map((obj) => {
    const { xOffset, length } = timeRangeToOffset(obj);
    return {
      id: obj.id,
      user: obj.user_id,
      workerName: obj.profiles.user_name,
      xOffset,
      yOffset: userToYOffsetMap[obj.user_id],
      length,
    };
  });
};

export const initializeStore = (dailyShifts, workers) =>
  create((set, get) => ({
    items: entryToDisplayItem(dailyShifts, workers),
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
