import { elementIds } from "./elements";
import type {
  AppDataKeys,
  AppDataReturnType,
  ElementMap,
  SendMessage,
} from "./types";

export const elements = Object.fromEntries(
  Object.entries(elementIds).map(([key, id]) => [
    key,
    document.getElementById(id) as HTMLElement,
  ])
) as ElementMap;

export async function sendMessage(msg: SendMessage): Promise<void> {
  chrome.runtime.sendMessage(msg);
}

export async function getSettings<K extends AppDataKeys>(
  key: K
): Promise<AppDataReturnType<K> | null> {
  try {
    const settings = await chrome.storage.local.get(key);
    alert(JSON.stringify(settings));
    return settings[key];
  } catch (error) {
    console.error(`Failed to get settings for key ${key}:`, error);
    return null;
  }
}

export function extractAuthString(url: string): string | null {
  const startIndex = url.indexOf("#tgWebAppData=") + "#tgWebAppData=".length;
  const endIndex = url.indexOf("&tgWebAppVersion");

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    return decodeURIComponent(url.substring(startIndex, endIndex));
  }
  return null;
}
