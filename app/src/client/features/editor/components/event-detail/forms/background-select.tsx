import { Button } from "@/client/components/shadcn/button";
import {
	FormField,
	FormItem,
	FormLabel,
} from "@/client/components/shadcn/form";
import { Separator } from "@/client/components/shadcn/separator";
import type { GameResources } from "@/client/schema";
import { useStore } from "@/client/stores";
import type { useForm } from "react-hook-form";

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
	const FORM_NAME = "backgroundId";

	return (
		<>
			<FormField
				key={FORM_NAME}
				control={form.control}
				name={FORM_NAME}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{label}</FormLabel>

						{field.value && resources.backgroundImage[field.value] ? (
							<div>
								<div className="w-full max-w-[200px] h-auto bg-cover bg-center bg-no-repeat rounded-md mb-2">
									<img
										src={resources.backgroundImage[field.value].url}
										alt="background"
									/>
								</div>
								<p className="text-sm text-gray-500 mb-2">
									{resources.backgroundImage[field.value].name}
								</p>
							</div>
						) : (
							<div>背景画像が選択されていません</div>
						)}

						<div className="flex gap-2 flex-wrap">
							<Button
								size="sm"
								onClick={() => {
									modalSlice.openModal("asset.select", {
										target: "backgroundImage",
										callback: (backgroundId: number) => {
											form.setValue(FORM_NAME, backgroundId, {
												shouldDirty: true,
											});
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
