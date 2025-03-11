import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/client/components/shadcn/form";
import { Input } from "@/client/components/shadcn/input";
import type { useForm } from "react-hook-form";

export const CharacterNameInput = ({
	form,
	label,
}: {
	form: ReturnType<typeof useForm>;
	label: string;
}) => {
	const FORM_NAME = "characterName";

	return (
		<FormField
			key={FORM_NAME}
			control={form.control}
			name={FORM_NAME}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input placeholder="キャラクター名を入力" {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
