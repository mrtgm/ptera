import { Button } from "@/client/components/shadcn/button";
import { cn } from "@/client/utils/cn";
import type { ResourceResponse } from "@ptera/schema";
import { UserCircle, UserPlus } from "lucide-react";

interface CharacterListProps {
  resources: ResourceResponse;
  selectedCharacterId: number | null;
  onCharacterSelect: (characterId: number) => void;
  onAddCharacterClick: () => void;
  onConfirmSelection?: () => void;
  selectionMode?: boolean;
}

export const CharacterList = ({
  resources,
  selectedCharacterId,
  onCharacterSelect,
  onAddCharacterClick,
  onConfirmSelection,
  selectionMode = false,
}: CharacterListProps) => {
  return (
    <div className="h-[500px] flex flex-col">
      <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-4 pb-4">
        {Object.values(resources.character).map((character) => {
          const previewImage =
            Object.values(character.images ?? {})[0]?.url || null;

          return (
            <div
              key={character.id}
              className={cn(
                "border h-fit rounded-md p-2 cursor-pointer hover:border-blue-500 flex flex-col",
                selectedCharacterId === character.id &&
                  "border-blue-500 bg-blue-50",
              )}
              onClick={() => onCharacterSelect(character.id)}
              onKeyDown={(e) =>
                e.key === "Enter" && onCharacterSelect(character.id)
              }
              aria-selected={selectedCharacterId === character.id}
            >
              <div className="aspect-square bg-gray-100 mb-2 flex items-center justify-center rounded overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-1/2 h-1/2 text-gray-400" />
                )}
              </div>
              <div className="text-center font-medium">{character.name}</div>
              <div className="text-xs text-gray-500 text-center">
                {Object.keys(character.images ?? {}).length}枚の画像
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onAddCharacterClick}
          className="flex items-center gap-2"
        >
          <UserPlus size={16} />
          キャラクターを追加
        </Button>

        {selectionMode && (
          <Button onClick={onConfirmSelection} disabled={!selectedCharacterId}>
            選択
          </Button>
        )}
      </div>
    </div>
  );
};

export default CharacterList;
