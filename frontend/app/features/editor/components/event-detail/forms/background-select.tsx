import type { useForm } from "react-hook-form";
import { Button } from "~/components/shadcn/button";
import { FormField, FormItem, FormLabel } from "~/components/shadcn/form";
import { Separator } from "~/components/shadcn/separator";
import type { GameResources } from "~/schema";
import { useStore } from "~/stores";

export const BackgroundSelect = ({
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
				key={"backgroundId"}
				control={form.control}
				name={"backgroundId"}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{label}</FormLabel>

						{field.value && resources.backgroundImages[field.value] ? (
							<>
								<div className="w-full max-w-[200px] h-auto bg-cover bg-center bg-no-repeat rounded-md mb-4">
									<img
										src={resources.backgroundImages[field.value].url}
										alt="background"
									/>
								</div>
								<p className="text-sm text-gray-500 mb-2">
									{resources.backgroundImages[field.value].filename}
								</p>
							</>
						) : (
							<div>背景画像が選択されていません</div>
						)}

						<div className="flex gap-2 flex-wrap">
							<Button
								size="sm"
								onClick={() => {
									modalSlice.openModal({
										target: "asset",
										params: {
											mode: "select",
											target: "backgroundImages",
											formTarget: "backgroundId",
										},
									});
								}}
								type="button"
							>
								背景画像を選択
							</Button>
						</div>
					</FormItem>
				)}
			/>

			<Separator className="my-4" />
		</>
	);
};
