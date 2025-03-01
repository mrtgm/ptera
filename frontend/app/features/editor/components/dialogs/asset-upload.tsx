import { ImageIcon, Music, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/shadcn/button";
import { Input } from "~/components/shadcn/input";
import { Label } from "~/components/shadcn/label";
import { cn } from "~/utils/cn";

interface AssetUploadProps {
	onFilesSelected: (files: FileList) => void;
	className?: string;
	label?: string;
	buttonText?: string;
	inputId?: string;
	assetType?: "image" | "audio" | "any"; // アセットタイプ（画像/音声/その他）
}

export const AssetUpload = ({
	onFilesSelected,
	className,
	label = "ファイルをドラッグ&ドロップするか、ボタンをクリックしてアップロード",
	buttonText = "ファイルを選択",
	inputId = "asset-upload",
	assetType = "any",
}: AssetUploadProps) => {
	const [dragActive, setDragActive] = useState(false);

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
			onFilesSelected(e.dataTransfer.files);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			onFilesSelected(e.target.files);
		}
	};

	const getAssetTypeConfig = () => {
		switch (assetType) {
			case "image":
				return {
					icon: <ImageIcon size={16} />,
					accept: "image/*",
				};
			case "audio":
				return {
					icon: <Music size={16} />,
					accept: "audio/*",
				};
			default:
				return {
					icon: <Upload size={16} />,
					accept: "*/*",
				};
		}
	};

	const { icon, accept } = getAssetTypeConfig();

	return (
		<div
			className={cn(
				"border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center",
				dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
				className,
			)}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<p className="text-sm text-gray-500 mb-2">{label}</p>
			<div>
				<Label htmlFor={inputId} className="cursor-pointer">
					<Button
						variant="outline"
						type="button"
						className="flex items-center gap-2"
						onClick={() => document.getElementById(inputId)?.click()}
					>
						{icon}
						{buttonText}
					</Button>
					<Input
						id={inputId}
						type="file"
						className="hidden"
						onChange={handleFileChange}
						multiple
						accept={accept}
					/>
				</Label>
			</div>
		</div>
	);
};
