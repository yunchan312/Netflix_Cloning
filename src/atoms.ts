import { atom } from "recoil";

export const setIndex = atom({
  key: "movie_index",
  default: 0,
});

export const isLeaving = atom({
  key: "leaving",
  default: false,
});
