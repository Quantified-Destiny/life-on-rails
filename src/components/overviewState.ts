import { create } from "zustand";

export enum State {
  None,
  CreateLinkedHabit,
}

interface CreateLinkedHabit {
  state: State.CreateLinkedHabit;
  habitId: string;
  desc: string;
}

interface OverviewStore {
  modal: CreateLinkedHabit | undefined;
  openCreateLinkedModal: (habitId: string, desc: string) => void;
  reset: () => void;
}

export const useOverviewStore = create<OverviewStore>()((set) => ({
  modal: undefined,
  openCreateLinkedModal: (habitId, desc) => {
    set((_state) => ({
      modal: { state: State.CreateLinkedHabit, habitId, desc },
    }));
  },
  reset: () => {
    set((_) => ({ modal: undefined }));
  },
}));
