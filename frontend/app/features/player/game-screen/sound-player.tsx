import { useEffect } from "react";
import type { ResourceCache, Stage } from "~/schema";
import { resourceManager } from "~/utils/preloader";

export const SoundPlayer = ({
	sound,
	resourceCache,
}: {
	sound: Stage["bgm"] | Stage["soundEffect"] | null;
	resourceCache: ResourceCache["bgms"] | ResourceCache["soundEffects"];
}) => {
	useEffect(() => {
		if (!sound) return;

		const resource = resourceCache[sound.id];
		if (!resource) return;

		if (sound.isPlaying) {
			if (!resource.cache.playing()) {
				resource.cache.play();
			}
			resource.cache.fade(0, sound.volume, sound.transitionDuration);
		}

		return () => {
			if (sound.isPlaying) return;
			resource.cache.fade(sound.volume, 0, sound.transitionDuration);
			resource.cache.once("fade", () => {
				resource.cache.stop();
			});
		};
	}, [sound, resourceCache]);

	return null;
};
