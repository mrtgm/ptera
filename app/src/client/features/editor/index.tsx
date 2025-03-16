import { RouterProvider, createBrowserRouter } from "react-router";
import Editor from "./editor";

export default function EditorRoutes() {
	const router = createBrowserRouter([
		{
			path: "/dashboard/games/:gameId/edit",
			element: <Editor />,
		},
		{
			path: "/dashboard/games/:gameId/edit/scenes/:sceneId",
			element: <Editor />,
		},
		{
			path: "/dashboard/games/:gameId/edit/scenes/:sceneId/events/:eventId",
			element: <Editor />,
		},
	]);

	return <RouterProvider router={router} />;
}
