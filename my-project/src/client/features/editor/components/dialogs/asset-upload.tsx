import { Alert, AlertDescription } from "@/client/components/shadcn/alert";
import { Button } from "@/client/components/shadcn/button";
import { Input } from "@/client/components/shadcn/input";
import { Label } from "@/client/components/shadcn/label";
import {
	type ValidationOptions,
	validateFiles,
} from "@/client/features/editor/utils/file-validator";
import { cn } from "@/client/utils/cn";
import { formatFileSize, getAcceptAttributeValue } from "@/client/utils/file";
import { AlertCircle, ImageIcon, Music, Upload } from "lucide-react";
import { useState } from "react";

interface AssetUploadProps {
	onFilesSelected: (files: FileList | File[]) => void;

	label?: string;
	buttonText?: string;

	assetType?: "image" | "audio" | "any";
	validation?: ValidationOptions;
}

export const AssetUpload = ({
	onFilesSelected,
	label = "ファイルをドラッグ&ドロップするか、ボタンをクリックしてアップロード",
	buttonText = "ファイルを選択",
	assetType = "any",
	validation = {},
}: AssetUploadProps) => {
	const [dragActive, setDragActive] = useState(false);
	const [validationError, setValidationError] = useState<string | null>(null);

	const { maxFileSize, allowedExtensions, maxFiles } = validation;

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
			const result = validateFiles(e.dataTransfer.files, {
				...validation,
				assetType,
			});

			setValidationError(result.error);

			if (result.validFiles.length > 0) {
				onFilesSelected(result.validFiles);
			}
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const result = validateFiles(e.target.files, {
				...validation,
				assetType,
			});

			setValidationError(result.error);

			if (result.validFiles.length > 0) {
				onFilesSelected(result.validFiles);
			}
		}
	};

	const getAssetTypeIcon = () => {
		switch (assetType) {
			case "image":
				return <ImageIcon size={16} />;
			case "audio":
				return <Music size={16} />;
			default:
				return <Upload size={16} />;
		}
	};

	const accept = getAcceptAttributeValue(assetType, allowedExtensions);

	return (
		<div className="space-y-2">
			<div
				className={cn(
					"border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center",
					dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
				)}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<p className="text-sm text-gray-500 mb-2">{label}</p>
				<div>
					<Label htmlFor="asset-upload" className="cursor-pointer">
						<Button
							variant="outline"
							type="button"
							className="flex items-center gap-2"
							onClick={() => document.getElementById("asset-upload")?.click()}
						>
							{getAssetTypeIcon()}
							{buttonText}
						</Button>
						<Input
							id="asset-upload"
							type="file"
							className="hidden"
							onChange={handleFileChange}
							multiple={maxFiles ? maxFiles > 1 : true}
							accept={accept}
						/>
					</Label>
				</div>
				{validation && (
					<div className="text-xs text-gray-400 mt-2">
						{maxFileSize && (
							<p>最大ファイルサイズ: {formatFileSize(maxFileSize)}</p>
						)}
						{maxFiles && <p>最大ファイル数: {maxFiles}</p>}
						{allowedExtensions && allowedExtensions.length > 0 && (
							<p>許可される形式: {allowedExtensions.join(", ")}</p>
						)}
					</div>
				)}
			</div>

			{validationError && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{validationError}</AlertDescription>
				</Alert>
			)}
		</div>
	);
};
