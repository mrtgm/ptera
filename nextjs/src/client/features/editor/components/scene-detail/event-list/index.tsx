import {
  type EventResponse,
  type GameDetailResponse,
  type ResourceResponse,
  type SceneResponse,
  sortEvent,
} from "@ptera/schema";
import { ArrowUp, Pen, Split } from "lucide-react";
import { SpeechBubble } from "../../speech-bubble";
import { EventItem } from "./event-item";

export const EventList = ({
  selectedScene,
  selectedEvent,
  game,
  resources,
  onClickEvent,
  onClickSceneEnding,
}: {
  selectedScene: SceneResponse | undefined | null;
  selectedEvent: EventResponse | undefined | null;
  game: GameDetailResponse;
  resources: ResourceResponse;
  onClickEvent: (eventId: number) => void;
  onClickSceneEnding: () => void;
}) => {
  if (!selectedScene) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col select-none overflow-x-hidden">
      <div className="relative flex w-full min-h-full">
        <div className="absolute w-1 bg-gray-300 h-full left-[8px]" />

        <div className="flex-1 relative w-full flex flex-col gap-y-3 pt-2">
          {selectedScene?.events.sort(sortEvent).map((event) => {
            return (
              <EventItem
                key={event.id}
                event={event}
                resources={resources}
                selectedEvent={selectedEvent}
                onClickEvent={onClickEvent}
              />
            );
          })}

          {renderSceneEnding(selectedScene, game, onClickSceneEnding)}
        </div>
      </div>
    </div>
  );
};

const renderSceneEnding = (
  selectedScene: SceneResponse,
  game: GameDetailResponse,
  onClickSceneEnding: () => void,
) => {
  if (selectedScene?.sceneType === "end") {
    return (
      <SpeechBubble
        key="ending"
        hex="#000000"
        title="ゲーム終了"
        icon={<Pen />}
        onClick={onClickSceneEnding}
      >
        エンディング
      </SpeechBubble>
    );
  }

  if (selectedScene?.sceneType === "choice") {
    return (
      <SpeechBubble
        key="choice"
        hex="#000000"
        title="選択肢"
        icon={<Split />}
        onClick={onClickSceneEnding}
      >
        {selectedScene.choices.map((choice) => (
          <div key={choice.id}>{choice.text}</div>
        ))}
      </SpeechBubble>
    );
  }

  if (selectedScene?.sceneType === "goto") {
    const nextScene = game.scenes.find(
      (scene) => scene.id === selectedScene.nextSceneId,
    );

    return (
      <SpeechBubble
        key="goto"
        hex="#000000"
        title="次のシーン"
        icon={<ArrowUp />}
        onClick={onClickSceneEnding}
      >
        {nextScene?.name || "不明なシーン"}
      </SpeechBubble>
    );
  }

  return null;
};
