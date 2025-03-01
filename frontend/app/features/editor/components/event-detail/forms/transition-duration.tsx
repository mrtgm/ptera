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
	const FORM_NAME = "transitionDuration";
	return (
		<FormField
			key={FORM_NAME}
			control={form.control}
			name={FORM_NAME}
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
