import clsx from "clsx";

export const Logo = ({ variant = "normal" }) => {
	return (
		<div className="flex items-center justify-center gap-4">
			<img
				src="/logo.png"
				alt="logo"
				className={clsx("object-contain", {
					"w-12": variant === "normal",
					"w-10": variant === "small",
				})}
			/>
			Ptera
		</div>
	);
};
