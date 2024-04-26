chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason !== "install") return;
    await chrome.storage.local.set({
      bookmarks: [],
      lastUsedId: 1,
    });
  });