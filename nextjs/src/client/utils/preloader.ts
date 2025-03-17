import type { ResourceCache } from "@/client/schema";
import type {
  AssetResponse,
  CharacterResponse,
  ResourceResponse,
} from "@ptera/schema";
import { Howl, type HowlOptions } from "howler";

export class ResourceManager {
  private static instance: ResourceManager;
  cache: ResourceCache = {
    character: {},
    backgroundImage: {},
    cgImage: {},
    soundEffect: {},
    bgm: {},
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
      character: {},
      backgroundImage: {},
      cgImage: {},
      soundEffect: {},
      bgm: {},
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

  async loadCharacter(character: CharacterResponse): Promise<void> {
    const characterImages = character.images;
    const loadPromises: Promise<void>[] = [];

    if (!characterImages) return;

    for (const [id, image] of Object.entries(characterImages)) {
      const loadPromise = this.loadImage(image.url).then((img) => {
        this.cache.character[character.id] = {
          ...character,
          images: {
            ...this.cache.character[character.id]?.images,
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

  async loadBackgroundImage(image: AssetResponse): Promise<void> {
    const img = await this.loadImage(image.url);
    this.cache.backgroundImage[image.id] = {
      ...image,
      cache: img,
    };
  }

  async loadCGImage(image: AssetResponse): Promise<void> {
    const img = await this.loadImage(image.url);
    this.cache.cgImage[image.id] = {
      ...image,
      cache: img,
    };
  }

  async loadSoundEffect(soundEffect: AssetResponse): Promise<void> {
    const sound = await this.loadSound(soundEffect.url, { loop: false });
    this.cache.soundEffect[soundEffect.id] = {
      ...soundEffect,
      cache: sound,
    };
  }

  async loadBGM(bgm: AssetResponse): Promise<void> {
    const sound = await this.loadSound(bgm.url, { loop: true });
    this.cache.bgm[bgm.id] = {
      ...bgm,
      cache: sound,
    };
  }

  async loadResources(resources: ResourceResponse): Promise<void> {
    const loadPromises: Promise<void>[] = [
      ...Object.values(resources.character).map((character) =>
        this.loadCharacter(character),
      ),
      ...Object.values(resources.backgroundImage).map((image) =>
        this.loadBackgroundImage(image),
      ),
      ...Object.values(resources.soundEffect).map((soundEffect) =>
        this.loadSoundEffect(soundEffect),
      ),
      ...Object.values(resources.bgm).map((bgm) => this.loadBGM(bgm)),
      ...Object.values(resources.cgImage).map((cgImage) =>
        this.loadCGImage(cgImage),
      ),
    ];

    await Promise.all(loadPromises);
  }

  getCacheState() {
    return {
      characters: Object.keys(this.cache.character).length,
      backgroundImages: Object.keys(this.cache.backgroundImage).length,
      soundEffects: Object.keys(this.cache.soundEffect).length,
      bgms: Object.keys(this.cache.bgm).length,
    };
  }
}

export const resourceManager = ResourceManager.getInstance();
