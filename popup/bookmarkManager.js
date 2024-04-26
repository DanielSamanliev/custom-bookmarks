async function quickAddBookmark() {
  chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    let currentTab = tabs[0];
    addBookmark(currentTab.title, currentTab.url);
  });
}

function addBookmark(title, url, folderName) {
  let bookmarksList = bookmarks;
  if (folderName && folderName !== "All Bookmarks") {
    if (!folderList.some((folder) => folder === folderName)) {
      bookmarksList = addFolder(folderName).bookmarks;
    } else {
      let folder = bookmarks.find((bookmark) => {
        return bookmark.type === "folder" && bookmark.name === folderName;
      });
      bookmarksList = folder.bookmarks;
    }
  }

  bookmarksList.push({
    name: title,
    url,
    type: BookmarkType.Bookmark,
    id: lastUsedId++,
  });

  updateUI();
  saveBookmarks();
}

function addFolder(name) {
  let folder = {
    name,
    bookmarks: [],
    type: BookmarkType.Folder,
    id: lastUsedId++,
  };

  folderList.push(folder.name);
  bookmarks.push(folder);
  return folder;
}




function editFolder(folderItem, folder, index, bookmarkList) {
  let folderDiv = folderItem.children[0];
  folderDiv.style.display = "none";
  let controlsDiv = folderItem.children[1];

  let inputField = document.createElement("input");
  inputField.setAttribute("type", "text");
  inputField.value = folder.name;

  folderItem.prepend(inputField);

  let saveControl = document.createElement("img");
  saveControl.className = "bookmark-controls";
  saveControl.src = "../images/check.svg";
  saveControl.addEventListener("click", () => {
    folder.name = inputField.value;

    inputField.remove();
    folderDiv.style.display = "flex";
    folderDiv.children[1].innerText = folder.name;
    controlsDiv.remove();
    createBookmarkControls(index, bookmarkList, folderItem);
    saveBookmarks();
  });

  controlsDiv.innerHTML = "";
  controlsDiv.append(saveControl);
}

function editBookmark(bookmarkItem, bookmark, bookmarkList, index, folder) {
  let editDiv = document.createElement("div");

  let inputField = document.createElement("input");
  inputField.setAttribute("type", "text");
  inputField.value = bookmark.name;

  let urlInputField = document.createElement("input");
  urlInputField.setAttribute("type", "text");
  urlInputField.value = bookmark.url;

  let folderField = document.createElement("input");
  folderField.type = "text";
  folderField.list = "folders";
  folderField.value = folder ? folder.name : "";

  editDiv.append(inputField);
  editDiv.append(urlInputField);
  editDiv.append(folderField);
  inputField.focus();

  let saveControl = document.createElement("img");
  saveControl.className = "bookmark-controls";
  saveControl.src = "../images/check.svg";
  saveControl.addEventListener("click", () => {
    const folderChanged = folder ? folderField.value !== folder.name : folderField.value && folderField.value !== "All Bookmarks";

    bookmark.name = inputField.value;
    bookmark.url = urlInputField.value;

    if (folderChanged) {
      bookmarkList.splice(index, 1);
      addBookmark(bookmark.name, bookmark.url, folderField.value);

      updateUI();
      return;
    }
    
    if (folder && folderField.value !== folder.name) {
      addBookmark(bookmark.title, bookmark.url, folder.name);
      return;
    }
  
    bookmarkItem.innerHTML = "";
    createBookmarkElem(bookmark, bookmarkItem, index, bookmarkList);
    saveBookmarks();
    filterBookmarks();
  });

  bookmarkItem.innerHTML = "";
  bookmarkItem.append(editDiv);
  bookmarkItem.append(saveControl);
}