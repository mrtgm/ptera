import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/client/components/shadcn/form";
import { Textarea } from "@/client/components/shadcn/textarea";
import type { useForm } from "react-hook-form";

export const TextInput = ({
	label,
	form,
}: {
	label: string;
	form: ReturnType<typeof useForm>;
}) => {
	const FORM_NAME = "text";

	return (
		<FormField
			key={FORM_NAME}
			control={form.control}
			name={FORM_NAME}
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
