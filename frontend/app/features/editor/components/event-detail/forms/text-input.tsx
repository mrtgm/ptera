import type { useForm } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/shadcn/form";
import { Textarea } from "~/components/shadcn/textarea";

export const TextInput = ({
	label,
	form,
}: {
	label: string;
	form: ReturnType<typeof useForm>;
}) => {
	return (
		<FormField
			key={"text"}
			control={form.control}
			name={"text"}
			render={({ field }) => {
				return (
					<FormItem>
						<FormLabel>{label}</FormLabel>
						<FormControl>
							<Textarea placeholder="テキストを入力" rows={6} {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
};
