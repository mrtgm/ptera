import type { useForm } from "react-hook-form";
import { Button } from "~/components/shadcn/button";
import { FormField, FormItem, FormLabel } from "~/components/shadcn/form";
import { Separator } from "~/components/shadcn/separator";
import type { GameResources } from "~/schema";
import { useStore } from "~/stores";

export const CharacterImageSelect = ({
	form,
	label,
	resources,
}: {
	form: ReturnType<typeof useForm>;
	label: string;
	resources: GameResources;
}) => {
	const modalSlice = useStore.useSlice.modal();

	return (
		<>
			<FormField
				key={"characterImageId"}
				control={form.control}
				name={"characterImageId"}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{label}</FormLabel>

						{field.value &&
						resources.characters[form.getValues().characterId] ? (
							<>
								<div className="w-full max-w-[200px] h-auto bg-cover bg-center bg-no-repeat rounded-md mb-4">
									<img
										src={
											resources.characters[form.getValues().characterId].images[
												field.value
											].url
										}
										alt="character"
									/>
								</div>
								<p className="text-sm text-gray-500 mb-2">
									{resources.characters[form.getValues().characterId].name}
								</p>
							</>
						) : (
							<div>キャラクター画像が選択されていません</div>
						)}

						<div className="flex gap-2 flex-wrap">
							<Button
								size="sm"
								onClick={() => {
									modalSlice.openModal({
										target: "character",
										params: {
											mode: "characterImage",
										},
									});
								}}
								type="button"
							>
								キャラクター画像を選択
							</Button>
							<Button
								size="sm"
								onClick={() => {
									modalSlice.openModal({
										target: "adjustSize",
										params: {
											target: "characters",
											characterId: form.getValues().characterId,
											assetId: field.value,
											position: form.getValues().position,
											scale: form.getValues().scale,
										},
									});
								}}
								type="button"
							>
								位置調整UIを開く
							</Button>
						</div>
					</FormItem>
				)}
			/>
			<Separator className="my-4" />
		</>
	);
};
