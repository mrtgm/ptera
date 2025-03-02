import { Link, useParams } from "@remix-run/react";
import { Button } from "~/components/shadcn/button";
import { Menubar } from "~/components/shadcn/menubar";
import { useStore } from "~/stores";

export const Header = () => {
	return (
		<Menubar className="rounded-none flex justify-between bg-[#1E1E1E] text-[#8D8D8D] w-full">
			<div className="p-2">
				<Link to="/dashboard">Ptera</Link>
			</div>
		</Menubar>
	);
};
