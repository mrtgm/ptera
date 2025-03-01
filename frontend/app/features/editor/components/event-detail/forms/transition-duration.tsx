import type { useForm } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/shadcn/form";
import { Input } from "~/components/shadcn/input";

export const TransitionDuration = ({
	form,
	label,
}: {
	form: ReturnType<typeof useForm>;
	label: string;
}) => {
	return (
		<FormField
			key={"transitionDuration"}
			control={form.control}
			name={"transitionDuration"}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input
							type="number"
							placeholder="トランジション時間を入力"
							{...field}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
