export const performUpdate = async <T>({
	api,
	optimisticUpdate,
	rollback,
	onSuccess,
	onError,
}: {
	api: () => Promise<T>;
	optimisticUpdate?: () => void;
	rollback?: () => void;
	onSuccess?: (result: T) => void;
	onError?: (error: unknown) => void;
}): Promise<T | undefined> => {
	optimisticUpdate?.();

	try {
		const result = await api();
		if (onSuccess && result) {
			onSuccess(result);
		}

		return result;
	} catch (error) {
		rollback?.();
		if (onError) {
			onError(error);
			console.error("Update error:", error);
		} else {
			console.error("Optimistic update error:", error);
		}
	}
};
