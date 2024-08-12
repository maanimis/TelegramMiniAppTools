function setData(data) {
  const dataElement = document.getElementById("data");
  if (dataElement) {
    dataElement.textContent = data || "[404] NOT FOUND!!";
  }
}

async function sendMessage(messageObj = {}) {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return chrome.tabs.sendMessage(activeTab.id, messageObj);
}

async function initializeButtons() {
  const copyButton = document.getElementById("copyButton");
  const getAuthButton = document.getElementById("getAuthButton");
  const toggleMiniAppButton = document.getElementById("toggleMiniAppButton");
  const originalUrlButton = document.getElementById("originalUrlButton");
  const dataElement = document.getElementById("data");

  const { toggleMiniAppButton: storedToggleStatus } =
    await chrome.storage.local.get("toggleMiniAppButton");
  const isMiniAppEnabled = storedToggleStatus?.isEnable ?? false;

  toggleMiniAppButton.textContent = isMiniAppEnabled
    ? "MiniApp in Web: Disable"
    : "MiniApp in Web: Enable";

  toggleMiniAppButton.addEventListener("click", async () => {
    const newStatus = !isMiniAppEnabled;
    await chrome.storage.local.set({
      toggleMiniAppButton: { isEnable: newStatus },
    });
    toggleMiniAppButton.textContent = newStatus
      ? "MiniApp in Web: Disable"
      : "MiniApp in Web: Enable";
    setData("[+] Done\n\n>>> Refresh the page");
  });

  getAuthButton.addEventListener("click", () => {
    sendMessage({ action: "getAuth" });
  });

  originalUrlButton.addEventListener("click", () => {
    sendMessage({ action: "getOriginUrl" });
  });

  copyButton.addEventListener("click", () => {
    navigator.clipboard
      .writeText(dataElement.textContent)
      .then(() => {
        copyButton.textContent = "Copied!";
        setTimeout(() => {
          copyButton.textContent = "Copy";
        }, 1500);
      })
      .catch((err) => alert(`Failed to copy authorization string: ${err}`));
  });
}

document.addEventListener("DOMContentLoaded", initializeButtons);

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "setData") {
    setData(request.data);
  }
});
