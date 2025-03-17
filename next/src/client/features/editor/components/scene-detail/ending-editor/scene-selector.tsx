import { Button } from "@/client/components/shadcn/button";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/client/components/shadcn/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/client/components/shadcn/popover";
import { Separator } from "@/client/components/shadcn/separator";
import type { GameDetailResponse } from "@ptera/schema";
import { ArrowRight, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";

interface SceneSelectorProps {
	game: GameDetailResponse | null;
	currentSceneId: number;
	selectedSceneId: number;
	onSelect: (sceneId: number) => void;
	onCreateNew: () => void;
	onNavigate?: (sceneId: number) => void;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({
	game,
	currentSceneId,
	selectedSceneId,
	onSelect,
	onCreateNew,
	onNavigate,
}) => {
	const [commandValue, setCommandValue] = useState("");

	const getSelectedSceneTitle = (sceneId: number) => {
		return game?.scenes.find((scene) => scene.id === sceneId)?.name || "未選択";
	};

	return (
		<div className="relative w-full flex">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="w-full justify-between font-normal"
					>
						{selectedSceneId
							? getSelectedSceneTitle(selectedSceneId)
							: "シーンを選択"}
						<ChevronDown className="h-4 w-4 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-full p-0"
					align="start"
					style={{
						width: "var(--radix-popover-trigger-width)",
					}}
				>
					<Command
						filter={(value, search) => {
							const scene = game?.scenes.find(
								(scene) => scene.id.toString() === value,
							);
							if (scene?.name.includes(search)) return 1;
							return 0;
						}}
						className="h-64"
					>
						<CommandInput
							placeholder="シーンを選択"
							value={commandValue}
							onValueChange={(value) => {
								setCommandValue(value);
							}}
						/>
						<CommandEmpty>No results found</CommandEmpty>
						<CommandList>
							{game?.scenes
								.filter((scene) => scene.id !== currentSceneId)
								.map((scene) => (
									<CommandItem
										key={scene.id}
										value={scene.id.toString()}
										onSelect={() => onSelect(scene.id)}
									>
										{scene.name}
									</CommandItem>
								))}
						</CommandList>
						<Separator />
						<div className="p-1">
							<Button
								variant="ghost"
								size="sm"
								className="w-full"
								onClick={onCreateNew}
							>
								<Plus className="h-4 w-4 mr-2" />
								新規シーンを作成
							</Button>
						</div>
					</Command>
				</PopoverContent>
			</Popover>

			{selectedSceneId && onNavigate && (
				<Button
					variant="outline"
					size="icon"
					onClick={() => onNavigate(selectedSceneId)}
					title="シーンへ移動"
					className="ml-2"
				>
					<ArrowRight className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
};
