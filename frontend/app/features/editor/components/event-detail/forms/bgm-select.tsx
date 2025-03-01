import type { useForm } from "react-hook-form";
import { Button } from "~/components/shadcn/button";
import { FormField, FormItem, FormLabel } from "~/components/shadcn/form";
import { Separator } from "~/components/shadcn/separator";
import type { GameResources } from "~/schema";
import { useStore } from "~/stores";

export const BGMSelect = ({
	label,
	form,
	resources,
}: {
	label: string;
	form: ReturnType<typeof useForm>;
	resources: GameResources;
}) => {
	const modalSlice = useStore.useSlice.modal();
	const FORM_NAME = "bgmId";

	return (
		<>
			<FormField
				key={FORM_NAME}
				control={form.control}
				name={FORM_NAME}
				render={({ field }) => (
					<FormItem className="flex flex-col items-end">
						<FormLabel className="mr-auto">{label}</FormLabel>

						{field.value && resources.bgms[field.value] ? (
							<>
								<div className="flex items-center gap-2 mb-2 w-full">
									<audio
										src={resources.bgms[field.value].url}
										controls
										className="w-full"
									>
										<track kind="captions" />
									</audio>
								</div>
								<p className="text-sm text-gray-500 mb-2 mr-auto">
									{resources.bgms[field.value].filename}
								</p>
							</>
						) : (
							<div className="text-sm text-gray-500 mb-2">
								BGMが選択されていません
							</div>
						)}

						<Button
							size="sm"
							onClick={() => {
								modalSlice.openModal("asset.select", {
									target: "bgms",
									callback: (bgmId: string) => {
										form.setValue(FORM_NAME, bgmId, { shouldDirty: true });
									},
								});
							}}
							type="button"
						>
							BGMを選択
						</Button>
					</FormItem>
				)}
			/>
			<Separator className="my-4" />
		</>
	);
};
