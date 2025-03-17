import { Logo } from "@/client/components/logo";
import { Button } from "@/client/components/shadcn/button";
import { Menubar } from "@/client/components/shadcn/menubar";
import { useStore } from "@/client/stores";
import Link from "next/link";

export const Header = () => {
	return (
		<Menubar className="rounded-none flex justify-between bg-[#1E1E1E] text-[#8D8D8D] w-full">
			<div className="p-2">
				<Link href="/dashboard">
					<Logo variant="small" />
				</Link>
			</div>
		</Menubar>
	);
};
