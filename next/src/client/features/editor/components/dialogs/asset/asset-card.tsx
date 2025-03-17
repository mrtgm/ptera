import { cn } from "@/client/utils/cn";
import { X } from "lucide-react";

interface AssetCardProps {
  id: number;
  selected?: boolean;
  onSelect?: (id: number) => void;
  onDelete?: (e: React.MouseEvent, id: number) => void;
  className?: string;
  showDeleteButton?: boolean;
  previewType?: "image" | "audio" | "video" | "placeholder";
  previewUrl?: string;
  filename?: string;
  title?: string;
  placeholderContent?: React.ReactNode;
  hasDeletePermission?: boolean;
}

export const AssetCard = ({
  id,
  selected = false,
  onSelect,
  onDelete,
  className,
  showDeleteButton = true,
  previewType = "placeholder",
  previewUrl = "",
  filename = "",
  title = "",
  placeholderContent,
  hasDeletePermission = true,
}: AssetCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSelect) {
      onSelect(id);
    }
  };

  const renderPreview = () => {
    switch (previewType) {
      case "image":
        return (
          <div className="aspect-square bg-gray-100 mb-2 overflow-hidden rounded">
            <img
              src={previewUrl}
              alt={title || filename}
              className="w-full h-full object-cover"
            />
          </div>
        );
      case "audio":
        return (
          <div className="aspect-video bg-gray-100 mb-2 flex items-center justify-center rounded text-gray-400">
            <audio
              src={previewUrl}
              className="w-full h-8"
              controls
              preload="metadata"
            >
              <track kind="captions" />
            </audio>
          </div>
        );
      default:
        return (
          <div className="aspect-video bg-gray-100 mb-2 flex items-center justify-center rounded text-gray-400">
            {placeholderContent}
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "border rounded-md p-2 cursor-pointer hover:border-blue-500 h-fit relative group",
        selected && "border-blue-500 bg-blue-50",
        className,
      )}
      onClick={() => onSelect?.(id)}
      onKeyDown={handleKeyDown}
      aria-selected={selected}
    >
      {renderPreview()}

      <div className="text-xs text-gray-500 truncate">{title || filename}</div>

      {/* 削除ボタン - ホバー時に表示 */}
      {showDeleteButton && hasDeletePermission && onDelete && (
        <button
          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => onDelete(e, id)}
          aria-label={`「${title || filename}」を削除`}
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
