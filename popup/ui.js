function updateUI() {
  let foldersDataList = document.getElementById("folders");
  foldersDataList.innerHTML = "<option value='All Bookmarks'></option>";
  folderList.forEach((folder) => {
    let option = document.createElement("option");
    option.value = folder;
    foldersDataList.append(option);
  });

  list.innerHTML = "";
  createBookmarkList(bookmarks, list);
  filterBookmarks();
}

function createBookmarkList(bookmarkList, listContainer, folder = undefined) {
  const listFragment = document.createDocumentFragment();

  bookmarkList
    .sort((a, b) => a.id - b.id)
    .forEach((bookmark, index) => {
      let item = document.createElement("li");
      if (bookmark.type === BookmarkType.Folder) {
        createFolderElem(bookmark, item, index, bookmarkList);
      } else {
        createBookmarkElem(bookmark, item, index, bookmarkList, folder);
      }

      listFragment.append(item);
    });
  listContainer.append(listFragment);
}

function createFolderElem(folder, item, index, bookmarkList) {
  if (!folder.bookmarks.length) {
    item.remove();
    return;
  }

  item.className = "folder-item";
  let folderDiv = document.createElement("div");
  folderDiv.className = "folder";

  let folderNameDiv = createFolderNameDiv(folder);
  folderDiv.append(folderNameDiv);

  createBookmarkControls(index, bookmarkList, folderDiv);

  item.append(folderDiv);

  let childList = document.createElement("ul");
  childList.className = "folder-list";
  childList.style.display = "none";
  createBookmarkList(folder.bookmarks, childList, folder);
  item.append(childList);

  folderNameDiv.addEventListener("click", () => {
    childList.style.display =
      childList.style.display === "none" ? "block" : "none";
  });
}

function createFolderNameDiv(folder) {
  let folderNameDiv = document.createElement("div");
  folderNameDiv.className = "folder-name";

  let icon = document.createElement("img");
  icon.src = "../images/folder.svg";
  folderNameDiv.append(icon);

  let folderName = document.createElement("span");
  folderName.innerText = folder.name;
  folderNameDiv.append(folderName);

  return folderNameDiv;
}

function createBookmarkElem(bookmark, item, index, bookmarkList, folder) {
  item.className = "bookmark";
  let urlDiv = document.createElement("div");
  urlDiv.className = "bookmark-url";
  urlDiv.innerText = bookmark.name;

  let url = bookmark.url;
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  urlDiv.addEventListener("click", function () {
    openBookmark(url);
  });
  item.append(urlDiv);
  console.log("bookmarkElem", folder);
  createBookmarkControls(index, bookmarkList, item, folder);
}

function openBookmark(url) {
  chrome.tabs.create({ url });
}

function createBookmarkControls(index, bookmarkList, item, folder) {
  let controlsDiv = document.createElement("div");
  controlsDiv.className = "bookmark-controls";

  let edit = document.createElement("img");
  edit.src = "../images/edit-3.svg";
  edit.addEventListener("click", () => {
    if (bookmarkList[index].type === BookmarkType.Bookmark) {
      console.log("createControls", folder);
      editBookmark(item, bookmarkList[index], bookmarkList, index, folder);
    } else {
      editFolder(item, bookmarkList[index], index, bookmarkList);
    }
  });

  let remove = document.createElement("img");
  remove.src = "../images/x.svg";
  remove.addEventListener("click", () => {
    bookmarkList.splice(index, 1);
    updateUI();
    saveBookmarks();
  });

  controlsDiv.append(edit);
  controlsDiv.append(remove);
  item.append(controlsDiv);
}
