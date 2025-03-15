import { Button } from "@/client/components/shadcn/button";
import {
	FormField,
	FormItem,
	FormLabel,
} from "@/client/components/shadcn/form";
import { Separator } from "@/client/components/shadcn/separator";
import { useStore } from "@/client/stores";
import { findFirstObjectValue } from "@/client/utils";
import type { ResourceResponse } from "@/schemas/games/dto";
import type { useForm } from "react-hook-form";

export const CharacterSelect = ({
	form,
	label,
	resources,
}: {
	form: ReturnType<typeof useForm>;
	label: string;
	resources: ResourceResponse;
}) => {
	const modalSlice = useStore.useSlice.modal();

	return (
		<>
			<FormField
				key={"characterId"}
				control={form.control}
				name={"characterId"}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{label}</FormLabel>

						{field.value &&
						resources.character[form.getValues().characterId] ? (
							<>
								<div className="w-full max-w-[200px] h-auto bg-cover bg-center bg-no-repeat rounded-md mb-4">
									<img
										src={
											findFirstObjectValue(
												resources.character[form.getValues().characterId]
													.images ?? {},
											)?.url
										}
										alt="character"
									/>
								</div>
								<p className="text-sm text-gray-500 mb-2">
									{resources.character[form.getValues().characterId].name}
								</p>
							</>
						) : (
							<div>キャラクターが選択されていません</div>
						)}

						<div className="flex gap-2 flex-wrap">
							<Button
								size="sm"
								onClick={() => {
									modalSlice.openModal("character.select", {
										callback: (characterId: number) => {
											form.setValue("characterId", characterId, {
												shouldDirty: true,
											});
										},
									});
								}}
								type="button"
							>
								キャラクターを選択
							</Button>
						</div>
					</FormItem>
				)}
			/>
			<Separator className="my-4" />
		</>
	);
};
