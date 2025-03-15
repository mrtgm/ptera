import { Button } from "@/client/components/shadcn/button";
import {
	FormField,
	FormItem,
	FormLabel,
} from "@/client/components/shadcn/form";
import { Separator } from "@/client/components/shadcn/separator";
import { useStore } from "@/client/stores";
import type { ResourceResponse } from "@/schemas/games/dto";
import type { useForm } from "react-hook-form";

export const SoundEffectSelect = ({
	label,
	form,
	resources,
}: {
	label: string;
	form: ReturnType<typeof useForm>;
	resources: ResourceResponse;
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

						{field.value && resources.soundEffect[field.value] ? (
							<>
								<div className="flex items-center gap-2 mb-2 w-full">
									<audio
										src={resources.soundEffect[field.value].url}
										controls
										className="w-full"
									>
										<track kind="captions" />
									</audio>
								</div>
								<p className="text-sm text-gray-500 mb-2 mr-auto">
									{resources.soundEffect[field.value].name}
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
										target: "soundEffect",
										callback: (soundEffectId: number) => {
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
