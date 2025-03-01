import type { useForm } from "react-hook-form";
import { Button } from "~/components/shadcn/button";
import { FormField, FormItem, FormLabel } from "~/components/shadcn/form";
import { Separator } from "~/components/shadcn/separator";
import type { GameResources } from "~/schema";
import { useStore } from "~/stores";

export const CGSelect = ({
	label,
	form,
	resources,
}: {
	label: string;
	form: ReturnType<typeof useForm>;
	resources: GameResources;
}) => {
	const modalSlice = useStore.useSlice.modal();
	const FORM_NAME = "cgImageId";

	return (
		<>
			<FormField
				key={FORM_NAME}
				control={form.control}
				name={FORM_NAME}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{label}</FormLabel>

						{field.value && resources.cgImages[field.value] ? (
							<>
								<div className="w-full max-w-[200px] h-auto bg-cover bg-center bg-no-repeat rounded-md mb-4">
									<img
										src={resources.cgImages[field.value].url}
										alt="CG"
										className="w-full h-auto rounded-md"
									/>
								</div>
								<p className="text-sm text-gray-500 mb-2">
									{resources.cgImages[field.value].filename}
								</p>
							</>
						) : (
							<div className="text-sm text-gray-500 mb-2">
								CGが選択されていません
							</div>
						)}

						<Button
							size="sm"
							onClick={() => {
								modalSlice.openModal("asset.select", {
									target: "cgImages",
									callback: (cgImageId: string) => {
										form.setValue(FORM_NAME, cgImageId);
									},
								});
							}}
							type="button"
						>
							CGを選択
						</Button>
					</FormItem>
				)}
			/>
			<Separator className="my-4" />
		</>
	);
};
