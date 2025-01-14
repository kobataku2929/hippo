import { create } from "zustand";
import data from "./data";

const timeRangeToOffset = ({ start, duration }) => {
  const offset = start / 60;
  const length = duration / 60;
  return { offset, length };
};

const entryToDisplayItem = (obj) => {
  const { offset, length } = timeRangeToOffset(obj);

  return {
    id: obj.id,
    worker: obj.worker,
    comfortRange: obj.comfortRange,
    offset,
    length,
  };
};
export const useStore = create((set, get) => ({
  items: data.map(entryToDisplayItem),
  getItem: (findId) => get().items.find(({ id }) => id === findId),
  updateItem: (idToUpdate, offset, length) => {
    set((state) => {
      const newItems = [...state.items];

      const item = newItems.find(({ id }) => idToUpdate === id);
      item.offset = offset;
      item.length = length;

      return {
        ...state,
        items: newItems,
      };
    });
  },
}));
