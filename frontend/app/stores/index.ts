import { type StoreApi, type UseBoundStore, create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { type UserState, createUserSlice } from "./user";

const sliceDefinitions = {
	user: createUserSlice,
} as const;

type SliceStates = {
	user: UserState;
};

// https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
type UnionToIntersection<U> = (
	U extends unknown
		? (k: U) => void
		: never
) extends (k: infer I) => void
	? I
	: never;

type SliceNames = keyof SliceStates;

export type State = UnionToIntersection<SliceStates[SliceNames]>;

type StoreWithSliceSelectors<S> = S extends {
	getState: () => State;
}
	? S & {
			use: {
				[K in keyof State]: () => State[K];
			};
			useSlice: {
				[K in SliceNames]: () => SliceStates[K];
			};
		}
	: never;

// セレクターを生成するヘルパー
export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
	_store: S,
) => {
	const store = _store as StoreWithSliceSelectors<typeof _store>;

	store.use = {} as StoreWithSliceSelectors<typeof _store>["use"];
	store.useSlice = {} as StoreWithSliceSelectors<typeof _store>["useSlice"];

	// 通常のセレクター
	for (const k of Object.keys(store.getState())) {
		(store.use as { [k: string]: () => unknown })[k] = () =>
			store((s) => s[k as keyof typeof s]);
	}

	// スライスごとのセレクターを生成 (ex. useSlice.player() で player スライスを取得)
	for (const sliceName of Object.keys(sliceDefinitions)) {
		(store.useSlice as { [k: string]: () => unknown })[sliceName] = () =>
			store((state) => {
				const sliceState = store.getState();
				const initialSliceState = sliceDefinitions[
					sliceName as keyof typeof sliceDefinitions
				](store.setState, store.getState, store as StoreApi<State>);

				// 初期状態のキーを使用してスライスの状態を構築
				const result: Record<string, unknown> = {};
				for (const key of Object.keys(initialSliceState)) {
					result[key] = sliceState[key as keyof typeof sliceState];
				}

				return result;
			});
	}

	return store;
};

export const useStore = createSelectors(
	create<
		State,
		[["zustand/devtools", never], ["zustand/subscribeWithSelector", never]]
	>(
		devtools(
			subscribeWithSelector((set, get, store) => {
				const sliceState = Object.entries(sliceDefinitions).reduce(
					(acc, [_key, createSlice]) => {
						const sliceValue = createSlice(set, get, store);
						for (const key of Object.keys(
							sliceValue,
						) as (keyof typeof sliceValue)[]) {
							acc[key] = sliceValue[key] as string &
								((state: Partial<UserState>) => void);
						}
						return acc;
					},
					{} as State,
				);

				return sliceState;
			}),
			{ name: "visualizer" },
		),
	),
);
