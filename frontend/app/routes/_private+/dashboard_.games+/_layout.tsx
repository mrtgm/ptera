import { type MetaFunction, Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
	return [
		{ title: "Noveller" },
		{
			name: "description",
			content: "Noveller is a new way to create, share, and play stories.",
		},
	];
};

export default function Index() {
	return <Outlet />;
}
