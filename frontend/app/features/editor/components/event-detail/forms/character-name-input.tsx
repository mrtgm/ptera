import type { useForm } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/shadcn/form";
import { Input } from "~/components/shadcn/input";

export const CharacterNameInput = ({
	form,
	label,
}: {
	form: ReturnType<typeof useForm>;
	label: string;
}) => {
	return (
		<FormField
			key={"characterName"}
			control={form.control}
			name={"characterName"}
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
