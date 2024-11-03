import { sendMessage, extractAuthString } from "../shared";

function getAuth(): void {
  const iframes = document.querySelectorAll("iframe");

  for (const iframe of iframes) {
    const src = iframe.getAttribute("src");
    if (src && src.includes("#tgWebAppData")) {
      const authString = extractAuthString(src);
      if (authString) {
        sendMessage({ action: "setData", data: authString });
      }
    }
  }
}

function getOriginUrl(): void {
  const iframe = document.querySelector("iframe");
  if (iframe?.src) {
    sendMessage({ action: "setData", data: iframe.src });
  }
}

// Message listener for content actions
chrome.runtime.onMessage.addListener((request: { action: string }) => {
  const { action } = request;

  switch (action) {
    case "getAuth":
      getAuth();
      break;
    case "getOriginUrl":
      getOriginUrl();
      break;
    default:
      console.warn(`Unknown action: ${action}`);
  }
});

// Clipboard event for copying selected text
document.addEventListener("copy", (e: ClipboardEvent) => {
  e.clipboardData?.setData(
    "text/plain",
    window.getSelection()?.toString() || ""
  );
  e.preventDefault();
});
