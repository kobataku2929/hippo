import { create } from "zustand";
import data from "./data";

const timeRangeToOffset = ({ start, duration }) => {
  const xOffset = start / 60;
  const length = duration / 60;
  return { xOffset, length };
};

const entryToDisplayItem = (obj) => {
  const { xOffset, length } = timeRangeToOffset(obj);

  return {
    id: obj.id,
    worker: obj.worker,
    comfortRange: obj.comfortRange,
    xOffset,
    length,
  };
};
export const useStore = create((set, get) => ({
  items: data.map(entryToDisplayItem),
  getItem: (findId) => get().items.find(({ id }) => id === findId),
  updateItem: (idToUpdate, worker, xOffset, length) => {
    set((state) => {
      const newItems = [...state.items];

      const item = newItems.find(({ id }) => idToUpdate === id);
      item.xOffset = xOffset;
      item.length = length;
      item.worker = worker;

      return {
        ...state,
        items: newItems,
      };
    });
  },
}));
