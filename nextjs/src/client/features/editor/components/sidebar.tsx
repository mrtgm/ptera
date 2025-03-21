import { Card } from "@/client/components/shadcn/card";
import { Separator } from "@/client/components/shadcn/separator";
import { useDraggable } from "@dnd-kit/core";
import type { SceneResponse, UpdateSceneSettingRequest } from "@ptera/schema";
import type { LucideProps } from "lucide-react";
import { cloneElement } from "react";
import type { SideBarSettings, SidebarItem } from "../constants";
import { SceneSettings } from "./scene-detail/scene-settings";

export const Sidebar = ({
  selectedScene,
  sideBarSettings,
  onSaveSettings,
}: {
  selectedScene: SceneResponse | undefined | null;
  sideBarSettings: typeof SideBarSettings;
  onSaveSettings: (data: UpdateSceneSettingRequest) => void;
}) => {
  if (!selectedScene) {
    return null;
  }

  return (
    <div className="h-[calc(100dvh-40px)] overflow-y-scroll overflow-x-hidden">
      <div className="p-4">
        <SceneSettings scene={selectedScene} onSaveSettings={onSaveSettings} />
      </div>
      <Separator className="my-2" />
      <div className="flex flex-col justify-center items-center border-r-[1px] border-gray-200">
        {Object.entries(sideBarSettings).map(([key, value]) => {
          return (
            <div key={key} className="w-full">
              <div className="w-full p-4 cursor-pointer text-sm">
                <div className="text-lg font-bold flex items-center gap-2">
                  <div
                    className="w-2 h-4"
                    style={{ backgroundColor: value.hex }}
                  />
                  {value.label}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {value.items.map((item) => (
                    <DraggableSidebarItem
                      item={item}
                      color={value.hex}
                      key={item.id}
                    />
                  ))}
                </div>
              </div>
              <Separator className="my-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DraggableSidebarItem = ({
  item,
  color,
}: {
  item: SidebarItem;
  color: string;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `sidebar-${item.id}`,
      data: {
        from: "sidebar", // Drag開始地点がサイドバーかどうかを区別
        item, // 実際の SidebarItem データ
        color, // サイドバーのカテゴリの色
      },
    });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <SidebarItemCore item={item} color={color} />
    </div>
  );
};

export const SidebarItemCore = ({
  item,
  color,
}: {
  item: SidebarItem;
  color: string;
}) => {
  return (
    <Card className="p-2 flex gap-2 items-center cursor-move hover:bg-gray-50 select-none">
      {cloneElement(item.icon, {
        color,
      } as LucideProps)}
      <div>{item.label}</div>
    </Card>
  );
};
