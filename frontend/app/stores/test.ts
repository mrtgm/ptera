import { type StateCreator, create } from "zustand";

export type CounterStore = {
	count: number;
	inc: () => void;
};

export const counterStoreCreator: StateCreator<CounterStore> = (set) => ({
	count: 1,
	inc: () => set((state) => ({ count: state.count + 1 })),
});

export const useCounterStore = create<CounterStore>()(counterStoreCreator);
