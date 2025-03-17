import { toast } from "sonner";
import { rethrowApiError } from "../api";

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
    }
    const res = rethrowApiError(error);
    toast.error(res.error.message);
  }
};
