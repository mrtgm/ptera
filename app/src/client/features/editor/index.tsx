import { BrowserRouter, Route, Routes } from "react-router";
import Editor from "./editor";

export default function EditorRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/dashboard/games/:gameId/edit" element={<Editor />} />
				<Route
					path="/dashboard/games/:gameId/edit/scenes/:sceneId"
					element={<Editor />}
				/>
				<Route
					path="/dashboard/games/:gameId/edit/scenes/:sceneId/events/:eventId"
					element={<Editor />}
				/>
			</Routes>
		</BrowserRouter>
	);
}
