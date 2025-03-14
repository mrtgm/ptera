import { Button } from "@/client/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/client/components/shadcn/dialog";
import { Label } from "@/client/components/shadcn/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/client/components/shadcn/popover";
import { Slider } from "@/client/components/shadcn/slider";
import { CircleHelp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { GameResources } from "@/client/schema";
import { useStore } from "@/client/stores";
import type { AdjustSizeParams } from "@/client/stores/modal";

interface Point {
	x: number;
	y: number;
}

export const AdjustSizeDialogContainer = ({
	resources,
}: {
	resources: GameResources | null;
}) => {
	const modalSlice = useStore.useSlice.modal();

	if (!resources || !modalSlice.params || modalSlice.modalType !== "adjustSize")
		return null;

	return (
		<Dialog
			open={modalSlice.isOpen}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					modalSlice.closeModal();
				}
			}}
		>
			<AdjustSizeDialog
				params={modalSlice.params as AdjustSizeParams}
				resources={resources}
			/>
		</Dialog>
	);
};

export const AdjustSizeDialog = ({
	resources,
	params,
}: {
	params: AdjustSizeParams;
	resources: GameResources;
}) => {
	const modalSlice = useStore.useSlice.modal();

	const containerRef = useRef<HTMLDivElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);

	const [scale, setScale] = useState(params.scale || 1);
	const [position, setPosition] = useState<[number, number]>(
		params.position || [0, 0],
	);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
	const [dragStartPosition, setDragStartPosition] = useState<[number, number]>([
		0, 0,
	]);

	useEffect(() => {
		const handleGlobalMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			window.addEventListener("mouseup", handleGlobalMouseUp);
		}

		return () => {
			window.removeEventListener("mouseup", handleGlobalMouseUp);
		};
	}, [isDragging]);

	const assetResource =
		params.target === "character"
			? resources.character[params.characterId].images[params.assetId]
			: resources.backgroundImage[params.assetId];

	if (!assetResource) return null;

	const imageUrl = assetResource.url;

	const handleWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		const delta = -Math.sign(e.deltaY) * 0.1;
		const newScale = Math.max(0.1, Math.min(5, scale + delta));
		setScale(newScale);
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		if (!containerRef.current) return;

		setIsDragging(true);
		setDragStart({ x: e.clientX, y: e.clientY });
		setDragStartPosition([...position]);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || !containerRef.current) return;

		const containerRect = containerRef.current.getBoundingClientRect();
		const containerWidth = containerRect.width;
		const containerHeight = containerRect.height;

		const deltaX = (e.clientX - dragStart.x) / containerWidth;
		const deltaY = (e.clientY - dragStart.y) / containerHeight;

		// 位置を更新 (-1 ～ 1 の範囲に制限)
		const newX = Math.max(-1, Math.min(1, dragStartPosition[0] + deltaX));
		const newY = Math.max(-1, Math.min(1, dragStartPosition[1] + deltaY));

		setPosition([newX, newY]);
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	// マウスが領域外に出た場合もドラッグ終了
	const handleMouseLeave = () => {
		setIsDragging(false);
	};

	const handleConfirm = () => {
		params.callback(position, scale);
		modalSlice.closeModal();
	};

	const handleReset = () => {
		setScale(1);
		setPosition([0, 0]);
	};

	return (
		<DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col">
			<DialogHeader>
				<DialogTitle>画像の位置とサイズを調整</DialogTitle>
			</DialogHeader>

			<div className="space-y-4 mt-6 h-full flex flex-col">
				{/* 画像プレビュー領域 */}
				<div
					ref={containerRef}
					className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden border"
					onWheel={handleWheel}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseLeave}
					style={{ cursor: isDragging ? "grabbing" : "grab" }}
				>
					<div className="absolute inset-0 flex items-center justify-center w-full h-full">
						{imageUrl ? (
							<img
								ref={imgRef}
								src={imageUrl}
								alt="調整する画像"
								className="w-auto select-none transition-transform duration-100 relative"
								style={{
									height: `${scale * 100}%`,
									top: `${position[1] * 100}%`,
									left: `${position[0] * 100}%`,
								}}
								draggable={false}
							/>
						) : (
							<div className="text-center text-gray-500">
								画像が見つかりません
							</div>
						)}
					</div>

					{/* ガイドライン（中心位置の表示） */}
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute top-1/2 left-0 right-0 border-t border-blue-400 opacity-50" />
						<div className="absolute left-1/2 top-0 bottom-0 border-l border-blue-400 opacity-50" />
					</div>
				</div>

				{/* スケールスライダー */}
				<div className="space-y-2">
					<div className="flex justify-between">
						<Label htmlFor="scale">拡大率: {scale.toFixed(2)}</Label>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handleReset}
								className="text-xs"
							>
								リセット
							</Button>

							<Popover>
								<PopoverTrigger asChild>
									<Button variant="ghost" size="icon">
										<CircleHelp />
									</Button>
								</PopoverTrigger>
								<PopoverContent>
									<div className="text-sm text-gray-500 mt-2">
										<p>操作方法:</p>
										<ul className="list-disc ml-5">
											<li>ドラッグ: 画像の位置を移動</li>
											<li>マウスホイール: 拡大・縮小</li>
										</ul>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<Slider
						id="scale"
						min={0.1}
						max={3}
						step={0.01}
						value={[scale]}
						onValueChange={(values) => setScale(values[0])}
					/>
				</div>

				{/* 位置情報の表示 */}
				<div className="flex items-center space-x-2">
					<Label>X位置: {position[0].toFixed(2)}</Label>
					<Label>Y位置: {position[1].toFixed(2)}</Label>
				</div>
			</div>

			<DialogFooter>
				<Button variant="outline" onClick={() => modalSlice.closeModal()}>
					キャンセル
				</Button>
				<Button onClick={handleConfirm}>確定</Button>
			</DialogFooter>
		</DialogContent>
	);
};
