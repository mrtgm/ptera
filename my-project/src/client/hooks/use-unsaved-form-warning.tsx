import Router from "next/router";
import { useEffect, useState } from "react";
import type { FieldValues, FormState } from "react-hook-form";
import { useBeforeUnload } from "react-use";

export const useUnsavedFormWarning = (
	formState: FormState<FieldValues>,
	message = "変更が保存されていません。このページから移動してもよろしいですか？",
) => {
	const [dirty, setDirty] = useState(formState.isDirty);
	useEffect(() => {
		setDirty(formState.isDirty);
	}, [formState]);

	useBeforeUnload(dirty, message);

	useEffect(() => {
		const handler = () => {
			if (dirty && !window.confirm(message)) {
				throw "キャンセル";
			}
		};

		Router.events.on("routeChangeStart", handler);

		return () => {
			Router.events.off("routeChangeStart", handler);
		};
	}, [dirty, message]);
};
