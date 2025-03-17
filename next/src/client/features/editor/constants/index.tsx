import { type GameEventType, getEventCategory } from "@ptera/schema";
import type { EventResponse } from "@ptera/schema";
import {
  EyeOff,
  FileImage,
  HeadphoneOff,
  Headphones,
  Image,
  MessageCircleMore,
  MessageCircleOff,
  Pen,
  UserMinus,
  UserX,
  Users,
  Volume2,
  Zap,
} from "lucide-react";
import type { ReactElement } from "react";
import type { ValidationOptions } from "../utils/file-validator";

export type ComponentType =
  | "text"
  | "character-name-input"
  | "character-select"
  | "character-image-select"
  | "position-select"
  | "transition-duration"
  | "bgm-select"
  | "volume-slider"
  | "sound-effect-select"
  | "background-select"
  | "effect-select"
  | "character-effect-select"
  | "cg-select";

export type SidebarItemParameter = {
  label: string;
  component: ComponentType;
};

export type SidebarItem = {
  id: string;
  type: GameEventType;
  icon: ReactElement;
  label: string;
  parameters: SidebarItemParameter[];
};

export const SideBarSettings: Record<
  EventResponse["category"],
  {
    hex: string;
    label: string;
    items: SidebarItem[];
  }
> = {
  message: {
    hex: "#6366F1", // Indigo
    label: "メッセージ",
    items: [
      {
        id: "text",
        type: "textRender", // matches EventType
        icon: <Pen />,
        label: "テキスト",
        parameters: [
          {
            label: "テキスト",
            component: "text",
          },
          {
            label: "キャラクタ名",
            component: "character-name-input",
          },
        ],
      },
      {
        id: "appearMessageWindow",
        type: "appearMessageWindow",
        icon: <MessageCircleMore />,
        label: "メッセージウィンドウを表示",
        parameters: [
          {
            label: "トランジション時間（秒）",
            component: "transition-duration",
          },
        ],
      },
      {
        id: "hideMessageWindow",
        type: "hideMessageWindow",
        icon: <MessageCircleOff />,
        label: "メッセージウィンドウを非表示",
        parameters: [
          {
            label: "トランジション時間（秒）",
            component: "transition-duration",
          },
        ],
      },
    ],
  },
  character: {
    hex: "#F59E0B", // Amber
    label: "キャラクター",
    items: [
      {
        id: "appearCharacter",
        type: "appearCharacter",
        icon: <Users />,
        label: "キャラクターを表示",
        parameters: [
          {
            label: "キャラクターと画像を選択",
            component: "character-image-select",
          },
          {
            label: "トランジション時間（秒）",
            component: "transition-duration",
          },
        ],
      },
      {
        id: "hideCharacter",
        type: "hideCharacter",
        icon: <UserMinus />,
        label: "キャラクターを非表示",
        parameters: [
          {
            label: "キャラクター",
            component: "character-select",
          },
          {
            label: "トランジション時間（秒）",
            component: "transition-duration",
          },
        ],
      },
      {
        id: "hideAllCharacters",
        type: "hideAllCharacters",
        icon: <UserX />,
        label: "すべてのキャラクターを非表示",
        parameters: [
          {
            label: "トランジション時間（秒）",
            component: "transition-duration",
          },
        ],
      },

      {
        id: "characterEffect",
        type: "characterEffect",
        icon: <Zap />,
        label: "キャラクターエフェクト",
        parameters: [
          {
            label: "キャラクター",
            component: "character-select",
          },
          {
            label: "エフェクト",
            component: "character-effect-select",
          },
          {
            label: "エフェクト時間（秒）",
            component: "transition-duration",
          },
        ],
      },
    ],
  },
  media: {
    hex: "#EC4899", // Pink
    label: "メディア",
    items: [
      {
        id: "bgmStart",
        type: "bgmStart",
        icon: <Headphones />,
        label: "BGM開始",
        parameters: [
          {
            label: "BGM",
            component: "bgm-select",
          },
          {
            label: "音量",
            component: "volume-slider",
          },
          {
            label: "トランジション時間（秒）",
            component: "transition-duration",
          },
        ],
      },
      {
        id: "bgmStop",
        type: "bgmStop",
        icon: <HeadphoneOff />,
        label: "BGM停止",
        parameters: [
          {
            label: "トランジション時間（秒）",
            component: "transition-duration",
          },
        ],
      },
      {
        id: "soundEffect",
        type: "soundEffect",
        icon: <Volume2 />,
        label: "効果音",
        parameters: [
          {
            label: "効果音",
            component: "sound-effect-select",
          },
          {
            label: "音量",
            component: "volume-slider",
          },
          {
            label: "トランジション時間（秒）",
            component: "transition-duration",
          },
        ],
      },
    ],
  },
  background: {
    hex: "#10B981", // Emerald
    label: "背景",
    items: [
      {
        id: "changeBackground",
        type: "changeBackground",
        icon: <Image />,
        label: "背景を変更",
        parameters: [
          {
            label: "背景",
            component: "background-select",
          },
          {
            label: "トランジション時間（秒）",
            component: "transition-duration",
          },
        ],
      },
    ],
  },
  effect: {
    hex: "#8B5CF6", // Violet
    label: "エフェクト",
    items: [
      {
        id: "effect",
        type: "effect",
        icon: <Zap />,
        label: "画面エフェクト",
        parameters: [
          {
            label: "エフェクト",
            component: "effect-select",
          },
          {
            label: "エフェクト時間（秒）",
            component: "transition-duration",
          },
        ],
      },
    ],
  },
  cg: {
    hex: "#F43F5E", // Rose
    label: "CG",
    items: [
      {
        id: "appearCG",
        type: "appearCG",
        icon: <FileImage />,
        label: "CGを表示",
        parameters: [
          {
            label: "CG",
            component: "cg-select",
          },
          {
            label: "トランジション時間（秒）",
            component: "transition-duration",
          },
        ],
      },
      {
        id: "hideCG",
        type: "hideCG",
        icon: <EyeOff />,
        label: "CGを非表示",
        parameters: [
          {
            label: "トランジション時間（秒）",
            component: "transition-duration",
          },
        ],
      },
    ],
  },
} as const;

export const FILE_VALIDATION_SETTING: ValidationOptions = {
  allowedExtensions: ["jpg", "jpeg", "png", "gif", "mp3"],
  maxFileSize: 1024 * 1024 * 5, // 5MB
};

export const getEventTitle = (type: GameEventType): string => {
  const title = Object.entries(SideBarSettings)
    .flatMap(([_, value]) => {
      return value.items.map((item) => {
        if (item.type === type) {
          return item.label;
        }
      });
    })
    .filter(Boolean);

  if (title.length === 0) {
    return "不明";
  }

  return title[0] as string;
};

export const getColorFromType = (type: EventResponse["eventType"]): string => {
  const category = getEventCategory(type);
  return SideBarSettings[category].hex;
};
