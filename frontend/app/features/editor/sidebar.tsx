import { cloneElement } from "react";
import { Card } from "~/components/shadcn/card";
import { ScrollArea } from "~/components/shadcn/scroll-area";
import { Separator } from "~/components/shadcn/separator";
import type { Scene } from "~/schema";
import type { SideBarSettings, SidebarItem } from "./constants";
import { SceneSettings, type SceneSettingsFormData } from "./scene-settings";

export const Sidebar = ({
	selectedScene,
	sideBarSettings,
	onItemClick,
	onSaveSettings,
}: {
	selectedScene: Scene | undefined;
	sideBarSettings: typeof SideBarSettings;
	onItemClick: (item: SidebarItem) => void;
	onSaveSettings: (data: SceneSettingsFormData) => void;
}) => {
	if (!selectedScene) {
		return null;
	}

	return (
		<div>
			<div className="p-2">
				<SceneSettings scene={selectedScene} onSaveSettings={onSaveSettings} />
			</div>
			<Separator className="my-2" />
			<ScrollArea className="flex flex-col justify-center items-center border-r-[1px] border-gray-200">
				{Object.entries(sideBarSettings).map(([key, value]) => {
					return (
						<div key={key} className="w-full">
							<div className="w-full p-2 cursor-pointer text-sm">
								<div className="text-lg font-bold flex items-center gap-2">
									<div
										className="w-2 h-4"
										style={{ backgroundColor: value.hex }}
									/>
									{value.label}
								</div>
								<div className="flex flex-wrap gap-2 mt-2">
									{value.items.map((item) => (
										<Card
											key={item.id}
											className="p-2 flex gap-2 items-center cursor-move hover:bg-gray-50 select-none"
											onClick={() => onItemClick(item)}
										>
											{cloneElement(item.icon, {
												color: value.hex,
											})}

											<div>{item.label}</div>
										</Card>
									))}
								</div>
							</div>
							<Separator className="my-2" />
						</div>
					);
				})}
			</ScrollArea>
		</div>
	);
};
