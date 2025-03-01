import type { useForm } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/shadcn/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/shadcn/select";
import { characterEffectType } from "~/schema";

export const CharacterEffectSelect = ({
	form,
	label,
}: {
	form: ReturnType<typeof useForm>;
	label: string;
}) => {
	const options = characterEffectType;
	const FORM_NAME = "effectType";

	return (
		<FormField
			key={FORM_NAME}
			control={form.control}
			name={FORM_NAME}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Select value={field.value} onValueChange={field.onChange}>
							<SelectTrigger>
								<SelectValue placeholder="エフェクトを選択" />
							</SelectTrigger>
							<SelectContent>
								{options.map((v) => (
									<SelectItem key={v} value={v}>
										{v}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
