import { elementIds } from "./elements";

export interface AppData {
  toggleMiniAppButton: { isEnable: boolean };
}

export type AppDataKeys = keyof AppData;

export type AppDataReturnType<K extends AppDataKeys> = AppData[K] | null;

export type ElementMap = {
  [K in keyof typeof elementIds]: HTMLElement;
};

export type ElementIdKeys = keyof typeof elementIds;

export interface SendMessage {
  action: string;
  data?: unknown;
}
