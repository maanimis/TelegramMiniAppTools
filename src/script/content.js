async function sendMessage(messageObj = {}) {
  chrome.runtime.sendMessage(messageObj);
}

async function getSettings(key) {
  try {
    const settings = await chrome.storage.local.get(key);
    return settings[key];
  } catch (error) {
    console.error(`Failed to get settings for key ${key}:`, error);
    return {};
  }
}

async function changeUA() {
  const toggleMiniAppButton = await getSettings("toggleMiniAppButton");

  if (!toggleMiniAppButton?.isEnable) return;

  const intervalId = setInterval(() => {
    const iframe = document.querySelector("iframe");
    if (iframe?.src) {
      iframe.src = iframe.src.replace(/(tgWebAppPlatform=)[^&]+/, "$1android");
      clearInterval(intervalId);
    }
  }, 1000);
}

function getAuth() {
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

function extractAuthString(url) {
  const startIndex = url.indexOf("#tgWebAppData=") + "#tgWebAppData=".length;
  const endIndex = url.indexOf("&tgWebAppVersion");

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    return decodeURIComponent(url.substring(startIndex, endIndex));
  }
  return null;
}

function getOriginUrl() {
  const iframe = document.querySelector("iframe");
  if (iframe?.src) {
    sendMessage({ action: "setData", data: iframe.src });
  }
}

chrome.runtime.onMessage.addListener((request) => {
  const { action } = request;

  switch (action) {
    case "getAuth":
      getAuth();
      break;
    case "changeUA":
      changeUA();
      break;
    case "getOriginUrl":
      getOriginUrl();
      break;
    default:
      console.warn(`Unknown action: ${action}`);
  }
});

document.addEventListener("copy", (e) => {
  e.clipboardData.setData("text/plain", window.getSelection().toString());
  e.preventDefault();
});

changeUA();
