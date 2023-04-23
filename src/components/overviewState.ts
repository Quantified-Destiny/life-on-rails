import { create } from "zustand";

export enum State {
  None,
  CreateLinkedHabit,
  CreateGoal,
  CreateHabit,
  CreateMetric,
}

interface CreateGoal {
  state: State.CreateGoal;
}
interface CreateHabit {
  state: State.CreateHabit;
}
interface CreateMetric {
  state: State.CreateMetric;
}

interface OverviewStore {
  modal: CreateGoal | CreateHabit | CreateMetric | undefined;
  openCreateGoalModal: () => void;
  openCreateHabitModal: () => void;
  openCreateMetricModal: () => void;
  reset: () => void;
}

export const useOverviewStore = create<OverviewStore>()((set) => ({
  modal: undefined,
  openCreateGoalModal() {
    set(() => ({
      modal: { state: State.CreateGoal },
    }));
  },
  openCreateHabitModal() {
    set(() => ({
      modal: { state: State.CreateHabit },
    }));
  },
  openCreateMetricModal() {
    set(() => ({
      modal: { state: State.CreateMetric },
    }));
  },
  reset: () => {
    set((_) => ({ modal: undefined }));
  },
}));
