"use client";
import { create } from "zustand";

type State = {
  batchId: string;
};

type Action = {
  updateBatchId: (batchId: State["batchId"]) => void;
};

export const useBatchStore = create<State & Action>((set) => ({
  batchId: "",
  updateBatchId: (batchId) => set(() => ({ batchId: batchId })),
}));
