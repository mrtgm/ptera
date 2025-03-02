import { Howl, type HowlOptions } from "howler";
import type {
	BGM,
	BackgroundImage,
	CGImage,
	Character,
	GameResources,
	ResourceCache,
	SoundEffect,
} from "~/schema";

export class ResourceManager {
	private static instance: ResourceManager;
	cache: ResourceCache = {
		characters: {},
		backgroundImages: {},
		cgImages: {},
		soundEffects: {},
		bgms: {},
	};

	private constructor() {}

	static getInstance(): ResourceManager {
		if (!ResourceManager.instance) {
			ResourceManager.instance = new ResourceManager();
		}
		return ResourceManager.instance;
	}

	clearCache() {
		this.cache = {
			characters: {},
			backgroundImages: {},
			cgImages: {},
			soundEffects: {},
			bgms: {},
		};
	}

	private loadImage(url: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
			img.src = url;
		});
	}

	private loadSound(
		url: string,
		options: Partial<HowlOptions> = {},
	): Promise<Howl> {
		return new Promise((resolve, reject) => {
			const sound = new Howl({
				src: url,
				...options,
				format: "mp3", // TODO: サポートするフォーマットを増やす
				onload: () => resolve(sound),
				onloaderror: () => reject(new Error(`Failed to load sound: ${url}`)),
			});
		});
	}

	async loadCharacter(character: Character): Promise<void> {
		const characterImages = character.images;
		const loadPromises: Promise<void>[] = [];

		for (const [id, image] of Object.entries(characterImages)) {
			const loadPromise = this.loadImage(image.url).then((img) => {
				this.cache.characters[character.id] = {
					...character,
					images: {
						...this.cache.characters[character.id]?.images,
						[id]: {
							...image,
							cache: img,
						},
					},
				};
			});
			loadPromises.push(loadPromise);
		}

		await Promise.all(loadPromises);
	}

	async loadBackgroundImage(image: BackgroundImage): Promise<void> {
		const img = await this.loadImage(image.url);
		this.cache.backgroundImages[image.id] = {
			...image,
			cache: img,
		};
	}

	async loadCGImage(image: CGImage): Promise<void> {
		const img = await this.loadImage(image.url);
		this.cache.cgImages[image.id] = {
			...image,
			cache: img,
		};
	}

	async loadSoundEffect(soundEffect: SoundEffect): Promise<void> {
		const sound = await this.loadSound(soundEffect.url, { loop: false });
		this.cache.soundEffects[soundEffect.id] = {
			...soundEffect,
			cache: sound,
		};
	}

	async loadBGM(bgm: BGM): Promise<void> {
		const sound = await this.loadSound(bgm.url, { loop: true });
		this.cache.bgms[bgm.id] = {
			...bgm,
			cache: sound,
		};
	}

	async loadResources(resources: GameResources): Promise<void> {
		const loadPromises: Promise<void>[] = [
			...Object.values(resources.characters).map((character) =>
				this.loadCharacter(character),
			),
			...Object.values(resources.backgroundImages).map((image) =>
				this.loadBackgroundImage(image),
			),
			...Object.values(resources.soundEffects).map((soundEffect) =>
				this.loadSoundEffect(soundEffect),
			),
			...Object.values(resources.bgms).map((bgm) => this.loadBGM(bgm)),
			...Object.values(resources.cgImages).map((cgImage) =>
				this.loadCGImage(cgImage),
			),
		];

		await Promise.all(loadPromises);
	}

	getCacheState() {
		return {
			characters: Object.keys(this.cache.characters).length,
			backgroundImages: Object.keys(this.cache.backgroundImages).length,
			soundEffects: Object.keys(this.cache.soundEffects).length,
			bgms: Object.keys(this.cache.bgms).length,
		};
	}
}

export const resourceManager = ResourceManager.getInstance();
