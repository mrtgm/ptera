import type { ResourceCache, Stage } from "@/client/schema";
import { useEffect } from "react";

export const SoundPlayer = ({
  sound,
  resourceCache,
}: {
  sound: Stage["bgm"] | Stage["soundEffect"] | null;
  resourceCache: ResourceCache["bgm"] | ResourceCache["soundEffect"];
}) => {
  useEffect(() => {
    if (!sound) return;

    const resource = resourceCache[sound.id];
    if (!resource) return;

    const cloned = new Howl({
      src: [resource.url],
      volume: 0,
      autoplay: true,
      loop: sound.loop,
    });

    if (sound.isPlaying) {
      if (!resource.cache.playing()) {
        cloned.play();
      }
      cloned.fade(0, sound.volume, sound.transitionDuration);
    }

    return () => {
      cloned.fade(sound.volume, 0, sound.transitionDuration);
      cloned.once("fade", () => {
        cloned.stop();
      });
    };
  }, [sound, resourceCache]);

  return null;
};
