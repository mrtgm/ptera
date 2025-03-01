import type { useForm } from "react-hook-form";
import { Button } from "~/components/shadcn/button";
import { FormField, FormItem, FormLabel } from "~/components/shadcn/form";
import { Separator } from "~/components/shadcn/separator";
import type { GameResources } from "~/schema";
import { useStore } from "~/stores";

export const SoundEffectSelect = ({
	label,
	form,
	resources,
}: {
	label: string;
	form: ReturnType<typeof useForm>;
	resources: GameResources;
}) => {
	const modalSlice = useStore.useSlice.modal();

	return (
		<>
			<FormField
				key={"soundEffectId"}
				control={form.control}
				name={"soundEffectId"}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{label}</FormLabel>

						{field.value && resources.soundEffects[field.value] ? (
							<>
								<div className="flex items-center gap-2 mb-2 w-full">
									<audio
										src={resources.soundEffects[field.value].url}
										controls
										className="w-full"
									>
										<track kind="captions" />
									</audio>
								</div>
								<p className="text-sm text-gray-500 mb-2 mr-auto">
									{resources.soundEffects[field.value].filename}
								</p>
							</>
						) : (
							<div className="text-sm text-gray-500 mb-2">
								サウンドエフェクトが選択されていません
							</div>
						)}

						<div className="flex gap-2 flex-wrap">
							<Button
								size="sm"
								onClick={() => {
									modalSlice.openModal("asset.select", {
										target: "soundEffects",
										callback: (soundEffectId: string) => {
											form.setValue("soundEffectId", soundEffectId, {
												shouldDirty: true,
											});
										},
									});
								}}
								type="button"
							>
								サウンドエフェクトを選択
							</Button>
						</div>
					</FormItem>
				)}
			/>
			<Separator className="my-4" />
		</>
	);
};
