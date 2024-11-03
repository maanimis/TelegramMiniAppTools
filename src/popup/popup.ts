import { sendMessage, getSettings, elements } from "../shared";

async function initializeButtons(): Promise<void> {
  const storedToggleStatus = await getSettings("toggleMiniAppButton");
  const isMiniAppEnabled = storedToggleStatus?.isEnable ?? false;

  elements.toggleMiniAppButton.textContent = isMiniAppEnabled
    ? "MiniApp in Web: Disable"
    : "MiniApp in Web: Enable";

  elements.toggleMiniAppButton.addEventListener("click", async () => {
    const newStatus = !isMiniAppEnabled;
    await chrome.storage.local.set({
      toggleMiniAppButton: { isEnable: newStatus },
    });
    elements.toggleMiniAppButton.textContent = newStatus
      ? "MiniApp in Web: Disable"
      : "MiniApp in Web: Enable";
    elements.data.textContent = "[+] Done\n\n>>> Refresh the page";
  });

  elements.getAuthButton.addEventListener("click", () => {
    sendMessage({ action: "getAuth" });
  });

  elements.originalUrlButton.addEventListener("click", () => {
    sendMessage({ action: "getOriginUrl" });
  });

  elements.copyButton.addEventListener("click", () => {
    navigator.clipboard
      .writeText(elements.data.textContent || "")
      .then(() => {
        elements.copyButton.textContent = "Copied!";
        setTimeout(() => {
          elements.copyButton.textContent = "Copy";
        }, 1500);
      })
      .catch((err) => alert(`Failed to copy authorization string: ${err}`));
  });
}

document.addEventListener("DOMContentLoaded", initializeButtons);
