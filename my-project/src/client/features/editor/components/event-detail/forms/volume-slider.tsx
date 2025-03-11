import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/client/components/shadcn/form";
import { Input } from "@/client/components/shadcn/input";
import type { useForm } from "react-hook-form";

export const VolumeSlider = ({
	form,
	label,
}: {
	form: ReturnType<typeof useForm>;
	label: string;
}) => {
	const FORM_NAME = "volume";

	return (
		<FormField
			key={FORM_NAME}
			control={form.control}
			name={FORM_NAME}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<div>
							<Input type="range" {...field} min={0} max={5} step={0.05} />
							<p className="text-sm text-gray-500">{field.value}</p>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
