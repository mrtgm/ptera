import type { ResourceCache, Stage } from "@/client/schema";
import type { EventResponse } from "@ptera/schema";
import type { EventManager } from "../../utils/event";
import { AnimatePresence } from "./animate-presence";

export const CG = ({
  manager,
  cg,
  currentEvent,
  resourceCache,
}: {
  manager: EventManager;
  cg: Stage["cg"];
  currentEvent: EventResponse | null;
  resourceCache: ResourceCache["cgImage"];
}) => {
  if (!currentEvent) return null;

  return (
    <AnimatePresence
      manager={manager}
      eventId={currentEvent.id}
      config={{
        enter: {
          configs: {
            duration: cg.transitionDuration,
            easing: "easeInOutQuad",
          },
        },
        exit: {
          configs: {
            duration: cg.transitionDuration,
            easing: "easeInOutQuad",
          },
        },
      }}
    >
      {cg.item && (
        <div id="cg" className="w-full h-full absolute" key={cg.item.id}>
          <img
            src={resourceCache[cg.item.id]?.url}
            alt=""
            className="w-full h-full object-cover"
          />
          {JSON.stringify(resourceCache)}
          {cg.item.id}
        </div>
      )}
    </AnimatePresence>
  );
};
