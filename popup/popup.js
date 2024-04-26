var bookmarks = [];
var lastUsedId = 1;
var folderList = [];

const list = document.getElementById("bookmarks-list");

document.addEventListener("DOMContentLoaded", async function () {
  await chrome.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      currentTab = tabs[0];
    });

  const quickButton = document.getElementById("quick-add");
  quickButton.addEventListener("click", () => {
    quickAddBookmark(currentTab.title, currentTab.url);
  });

  const addButton = document.getElementById("bookmark-button");
  addButton.addEventListener("click", function () {
    let title = document.getElementById("title");
    let url = document.getElementById("url");
    let folderName = document.getElementById("folder-input").value;
    if (!title.value || !url.value) {
      return;
    }

    addBookmark(title.value, url.value, folderName);
    title.value = "";
    url.value = "";
  });

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", filterBookmarks)

  await loadBookmarks();
  updateUI();
});

async function loadBookmarks() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["bookmarks", "lastUsedId"], function (data) {
      bookmarks = data.bookmarks ? JSON.parse(data.bookmarks) : [];
      lastUsedId = data.lastUsedId || 1;

      folderList = bookmarks
        .filter((bookmark) => bookmark.type === BookmarkType.Folder)
        .map((bookmark) => bookmark.name);

      resolve();
    });
  });
}

function saveBookmarks() {
  chrome.storage.local.set({
    bookmarks: JSON.stringify(bookmarks),
    lastUsedId: lastUsedId,
  });
}

function filterBookmarks() {
  const searchText = document.getElementById("search-input").value.toLowerCase();
  const bookmarkItems = document.querySelectorAll(".bookmark");

  bookmarkItems.forEach(item => {
    const bookmarkTitle = item.innerText.toLowerCase();
    item.style.display = bookmarkTitle.includes(searchText) ? "flex" : "none"
  })
}

const BookmarkType = {
  Bookmark: "bookmark",
  Folder: "folder"
}