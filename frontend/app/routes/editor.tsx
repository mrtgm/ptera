import { useEffect } from "react";
import { Editor } from "~/features/editor";

export default function SceneList() {
	useEffect(() => {
		console.log("fuck");
	}, []);
	return (
		<div className="w-full h-dvh flex justify-center">
			<Editor />
		</div>
	);
}
