import { useEffect, useRef } from "react";
import type { FieldValues, FormState } from "react-hook-form";
import { unstable_usePrompt, useBeforeUnload } from "react-router";

export const useUnsavedFormWarning = (
  formState: FormState<FieldValues>,
  message = "変更が保存されていません。このページから移動してもよろしいですか？",
) => {
  const dirtyRef = useRef(formState.isDirty);
  useEffect(() => {
    dirtyRef.current = formState.isDirty;
  }, [formState]);

  useBeforeUnload(() => {
    if (dirtyRef.current) {
      return message;
    }
  });

  unstable_usePrompt({
    message,
    when: ({ currentLocation, nextLocation }) =>
      dirtyRef.current && currentLocation.pathname !== nextLocation.pathname,
  });
};
