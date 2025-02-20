import type { MetaFunction } from "@remix-run/node";

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
	return <div>TBD</div>;
}
