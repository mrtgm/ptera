import { Film, Image, Music, Volume2 } from "lucide-react";
import {
	type ReactElement,
	ReactHTMLElement,
	cloneElement,
	useEffect,
	useState,
} from "react";
import { omit } from "remeda";
import { Button } from "~/components/shadcn/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/shadcn/dialog";
import { Input } from "~/components/shadcn/input";
import { Label } from "~/components/shadcn/label";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/shadcn/tabs";
import type { GameResources } from "~/schema";
import { useStore } from "~/stores";
import type { ModalParams } from "~/stores/modal";
import { cn } from "~/utils/cn";
import type { AssetFormType } from "./event-editor";

type OmittedResources = Omit<GameResources, "characters">;

export const AssetDialog = ({
	resources,
	onConfirmAssetSelection,
}: {
	resources: GameResources;
	onConfirmAssetSelection: (assetId: string, type: AssetFormType) => void;
}) => {
	const modalSlice = useStore.useSlice.modal();

	const [omittedResources] = useState<OmittedResources>(() =>
		omit(resources, ["characters"]),
	);

	const [activeTab, setActiveTab] =
		useState<keyof OmittedResources>("backgroundImages");
	const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
	const [dragActive, setDragActive] = useState(false);

	useEffect(() => {
		// モーダル開いた時にアセットタイプが指定されている場合、そのタイプをアクティブタブに設定
		if (
			modalSlice.isOpen &&
			(modalSlice.params as ModalParams["asset"])?.target
		) {
			setActiveTab(() => (modalSlice.params as ModalParams["asset"])?.target);
		}
	}, [modalSlice.isOpen, modalSlice.params]);

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			handleFiles(e.dataTransfer.files, activeTab);
		}
	};

	const handleFiles = (files: FileList, type: keyof OmittedResources) => {
		// TODO;
		for (const file of Array.from(files)) {
			console.log(`Uploading ${file.name} to ${type}`);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			handleFiles(e.target.files, activeTab);
		}
	};

	const handleAssetSelect = (assetId: string) => {
		if ((modalSlice.params as ModalParams["asset"])?.mode === "select") {
			setSelectedAsset(assetId);
		}
	};

	const handleConfirmSelection = () => {
		if (selectedAsset) {
			onConfirmAssetSelection(
				selectedAsset,
				(modalSlice.params as ModalParams["asset"])
					?.formTarget as AssetFormType,
			);
			modalSlice.closeModal();
		}
	};

	const AssetModalSideBarSettings: Record<
		keyof OmittedResources,
		{
			label: string;
			icon: ReactElement;
		}
	> = {
		backgroundImages: {
			label: "背景",
			icon: <Film />,
		},
		cgImages: {
			label: "CG",
			icon: <Image />,
		},
		bgms: {
			label: "BGM",
			icon: <Music />,
		},
		soundEffects: {
			label: "効果音",
			icon: <Volume2 />,
		},
	};

	return (
		<Dialog
			open={modalSlice.isOpen && modalSlice.target === "asset"}
			onOpenChange={modalSlice.closeModal}
		>
			<DialogContent className="sm:max-w-4xl">
				<DialogHeader>
					<DialogTitle>アセット一覧</DialogTitle>
					<DialogDescription>
						{(modalSlice.params as ModalParams["asset"])?.mode === "select"
							? "使用するアセットを選択してください"
							: "アセットの管理を行います"}
					</DialogDescription>
				</DialogHeader>

				<div className="flex h-[500px] gap-4">
					<div className="w-[200px] border-r pr-4">
						<Tabs
							orientation="vertical"
							value={activeTab}
							onValueChange={(v) => setActiveTab(v as keyof OmittedResources)}
							className="w-full"
						>
							<TabsList className="flex flex-col h-auto items-start">
								{Object.keys(AssetModalSideBarSettings).map((key) => {
									const settings =
										AssetModalSideBarSettings[
											key as keyof typeof AssetModalSideBarSettings
										];
									return (
										<TabsTrigger
											key={key}
											value={key}
											disabled={
												(modalSlice.params as ModalParams["asset"])?.mode ===
													"select" && key !== activeTab
											}
											className="justify-start grid grid-cols-8 gap-2"
										>
											{cloneElement(settings.icon, {
												className: "col-span-1 w-full",
											})}
											{settings.label}
										</TabsTrigger>
									);
								})}
							</TabsList>
						</Tabs>
					</div>

					<div className="flex-1 overflow-hidden">
						<Tabs value={activeTab} className="w-full h-full flex flex-col">
							<TabsContent
								key={activeTab}
								value={activeTab}
								className="flex-1 flex flex-col h-full"
							>
								<div className="flex-1 overflow-y-auto grid grid-cols-3 gap-4 pb-4">
									{Object.values(omittedResources[activeTab]).map((asset) => (
										<div
											key={asset.id}
											className={cn(
												"border rounded-md p-2 cursor-pointer hover:border-blue-500 flex flex-col h-fit",
												selectedAsset === asset.id &&
													"border-blue-500 bg-blue-50",
											)}
											onClick={() => handleAssetSelect(asset.id)}
											onKeyDown={() => {}}
										>
											{/* TODO: サムネイル生成 */}
											{activeTab === "backgroundImages" ||
											activeTab === "cgImages" ? (
												<div className="aspect-video bg-gray-100 mb-2 overflow-hidden rounded">
													<img
														src={asset.url}
														alt={asset.filename}
														className="w-full h-full object-cover"
													/>
												</div>
											) : (
												<div className="aspect-video bg-gray-100 mb-2 flex items-center justify-center rounded">
													{activeTab}
												</div>
											)}

											<div className="flex justify-between items-center">
												<div className="text-xs text-gray-500 truncate">
													{asset.filename}
												</div>
											</div>
										</div>
									))}
								</div>

								<div
									className={cn(
										"mt-4 border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center",
										dragActive
											? "border-blue-500 bg-blue-50"
											: "border-gray-300",
									)}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
								>
									<p className="text-sm text-gray-500 mb-2">
										ファイルをドラッグ&ドロップするか、ボタンをクリックしてアップロード
									</p>
									<div>
										<Label htmlFor="file-upload" className="cursor-pointer">
											<Button variant="outline" type="button">
												ファイルを選択
											</Button>
											<Input
												id="file-upload"
												type="file"
												className="hidden"
												onChange={handleFileChange}
												multiple
												accept={
													activeTab === "backgroundImages" ||
													activeTab === "cgImages"
														? "image/*"
														: "audio/*"
												}
											/>
										</Label>
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>

				{(modalSlice.params as ModalParams["asset"])?.mode === "select" && (
					<DialogFooter className="sm:justify-end">
						<Button
							type="button"
							variant="secondary"
							onClick={modalSlice.closeModal}
						>
							キャンセル
						</Button>
						<Button
							type="button"
							onClick={handleConfirmSelection}
							disabled={!selectedAsset}
						>
							選択
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default AssetDialog;
