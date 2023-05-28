import { jest } from "@jest/globals";
import { Library } from "../../src/assets/js/library";
import StorageManager from "../../src/assets/js/storageManager.js";

describe("Library tests", () => {
  const assignMock = jest.fn();
  const clearHTML = () => (document.body.innerHTML = "");
  let library;

  const setUpHTML = () => {
    // TODO : compléter la configuration du HTML pour les conteneurs de Playlists et Chansons
    const searchBar = document.createElement("input");
    searchBar.setAttribute("id", "search-input");
    document.body.appendChild(searchBar);

    const searchButton = document.createElement("button");
    searchButton.setAttribute("id", "search-btn");
    document.body.appendChild(searchButton);

    const specificSearchInput = document.createElement("input");
    specificSearchInput.setAttribute("id", "exact-search");
    document.body.appendChild(specificSearchInput);

    const clearSearch = document.createElement("i");
    clearSearch.setAttribute("id", "clear-search-bar");
    document.body.appendChild(clearSearch);

    const playlistList = document.createElement("div");
    playlistList.setAttribute("id", "playlist-list");
    const playlistTitle = document.createElement("h1");
    playlistTitle.textContent = "Mes Playlists";
    const playlistContainer = document.createElement("section");
    playlistContainer.setAttribute("id", "playlist-container");
    playlistContainer.classList.add("playlist-container");
    playlistList.appendChild(playlistTitle);
    playlistList.appendChild(playlistContainer);
    document.body.appendChild(playlistList);

    const songsList = document.createElement("div");
    songsList.setAttribute("id", "songs-list");
    const songContainer = document.createElement("section");
    const songTitle = document.createElement("h1");
    songTitle.textContent = "Mes Chansons";
    songContainer.setAttribute("id", "song-container");
    songContainer.classList.add("flex-column");
    songsList.appendChild(songTitle);
    songsList.appendChild(songContainer);

    document.body.appendChild(songsList);
  };

  beforeEach(() => {
    delete window.location;
    window.location = { assign: assignMock };
    setUpHTML();
    library = new Library();
    library.storageManager = new StorageManager();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    assignMock.mockClear();
    clearHTML();
  });

  it("Library should be instanciated correctly", () => {
    expect(library.storageManager).toEqual(new StorageManager());
  });

  it("generateLists should call buildPlaylistItem and buildSongItem, and append children to containers", () => {
    // TODO
    const buildPlaylistItemSpy = jest.spyOn(library, "buildPlaylistItem").mockImplementation(() => {
      return document.createElement("a");
    });
    const buildSongItemSpy = jest.spyOn(library, "buildSongItem").mockImplementation(() => {
      return document.createElement("div");
    });
    const playlistHTML = document.getElementById("playlist-container");
    const playlist = [{ id: "0", name: "Ma Premiere Playlist", description: "Playlist de base", thumbnail: "./assets/img/default.png", songs: [{ id: 0 }, { id: 1 }] }, { id: "1", name: "Playlist de Rock", description: "Playlist avec une descrption beaucoup plus longue", thumbnail: "./assets/img/rock.jpg", songs: [{ id: 0 }, { id: 3 }, { id: 4 }] }];
    const song = [{ id: 0, name: "Whip", artist: "prazkhanal", src: "./assets/media/01_song.mp3", genre: "Electronic", liked: false }];
    library.generateLists(playlist, song);

    expect(buildPlaylistItemSpy).toHaveBeenCalled();
    expect(buildSongItemSpy).toHaveBeenCalled();
    expect(playlistHTML.childElementCount).not.toEqual(0);
  });

  it("buildPlaylistItem should build playlist's item", () => {
    const playlist = { name: "Ma Premiere Playlist", description: "Playlist de base", thumbnail: "./assets/img/default.png" };
    const playlistItem = library.buildPlaylistItem(playlist);
    expect(playlistItem.hasChildNodes()).toEqual(true);
    expect(playlistItem.innerHTML).toEqual(
      `<div class="playlist-preview"><img src=\"${playlist.thumbnail}\"><i class="fa fa-2x fa-play-circle hidden playlist-play-icon"></i></div><p>${playlist.name}</p><p>${playlist.description}</p>`
    );
  });

  it("buildSongItem should build song's item", () => {
    // TODO
    const song = { id: 0, name: "Whip", artist: "prazkhanal", src: "./assets/media/01_song.mp3", genre: "Electronic", liked: false };
    const songItem = library.buildSongItem(song);
    expect(songItem.hasChildNodes()).toEqual(true);
    expect(songItem.innerHTML).toEqual(
      `<p>${song.name}</p><p>${song.genre}</p><p>${song.artist}</p><button class="fa-heart fa-2x fa-regular"></button>`
    );
  });

  it("buildSongItem should add a call to StorageManager.replaceItem on click event and change the classList", () => {
    // TODO
    const event = new Event("click");
    const replaceItemSpy = jest.spyOn(library.storageManager, "replaceItem").mockImplementation(() => {});

    const song = { id: 0, name: "Whip", artist: "prazkhanal", src: "./assets/media/01_song.mp3", genre: "Electronic", liked: false };

    const songContainer = document.getElementById("song-container")
    songContainer.appendChild(library.buildSongItem(song));
    document.body.appendChild(songContainer);

    const likeButton = document.querySelector("div button.fa-heart");
    const classListBeforeClick = likeButton.classList;
    likeButton.dispatchEvent(event);

    const classListAfterClick = likeButton.classList;
    expect(replaceItemSpy).toHaveBeenCalled();
    expect(replaceItemSpy).toHaveBeenCalledWith(library.storageManager.STORAGE_KEY_SONGS, song);
    expect(classListBeforeClick[0]).not.toEqual(classListAfterClick[2]);
  });

  it("load should load window", () => {
    const storageManagerLoadAllDataSpy = jest.spyOn(library.storageManager, "loadAllData").mockImplementation(() => {});
    const storageManagerGetDataSpy = jest.spyOn(library.storageManager, "getData").mockImplementation(() => {});
    const libraryGenerateListsSpy = jest.spyOn(library, "generateLists").mockImplementation(() => {});
    library.load();
    expect(storageManagerLoadAllDataSpy).toBeCalled();
    expect(storageManagerGetDataSpy).toHaveBeenCalledTimes(2);
    expect(libraryGenerateListsSpy).toBeCalled();
  });

  describe("Search bar tests", () => {
    it("clicking on the search button should prevent form submission and call search", () => {
      const event = new Event("click");
      const eventSpy = jest.spyOn(event, "preventDefault");
      const searchSpy = jest.spyOn(library, "search").mockImplementation(() => {});
      library.load();
      document.getElementById("search-btn").dispatchEvent(event);

      expect(eventSpy).toHaveBeenCalled();
      expect(searchSpy).toHaveBeenCalled();
    });

    it("clicking on the search button should call search with correct parameters", () => {
      const searchSpy = jest.spyOn(library, "search").mockImplementation(() => {});
      jest.spyOn(library.storageManager, "getData").mockImplementation(() => []);
      document.getElementById("exact-search").checked = true;
      library.load();
      document.getElementById("search-btn").click();
      expect(searchSpy).toHaveBeenCalledWith(document.getElementById("search-input"), { playlists: [], songs: [] }, true);
    });

    it("includesSubstring should return true if substring is in original string without exactMatch", () => {
      const originalString = "Test";
      const subString = "es";
      expect(library.includesSubstring(originalString, subString, false)).toBeTruthy();
    });

    it("includesSubstring should return false if substring is not in original string without exactMatch", () => {
      const originalString = "Test";
      const subString = "abc";
      expect(library.includesSubstring(originalString, subString, false)).toBeFalsy();
    });

    it("includesSubstring should return true if substring is in original string with exactMatch", () => {
      const originalString = "Test";
      const subString = "Te";
      expect(library.includesSubstring(originalString, subString, true)).toBeTruthy();
    });

    it("includesSubstring should return false if substring is not in original string with exactMatch", () => {
      const originalString = "Test";
      const subString = "te";
      expect(library.includesSubstring(originalString, subString, true)).toBeFalsy();
    });

    it("searchInFields should return true if atleast one field contains the string", () => {
      const fields = ["Bounce", "Coma-Media", "Electronic"];
      const subString = "co";
      expect(library.searchInFields(fields, subString, false)).toBeTruthy();
    });

    it("searchInFields should return false if none of the fields contains the string", () => {
      const fields = ["Bounce", "Coma-Media", "Electronic"];
      const subString = "def";
      expect(library.searchInFields(fields, subString, false)).toBeFalsy();
    });

    it("searchInFields should call includesSubstring", () => {
      const fields = ["Bounce", "Coma-Media", "Electronic"];
      const spy = jest.spyOn(library, "includesSubstring").mockImplementation(() => true);
      library.searchInFields(fields, "allo", false);
      expect(spy).toHaveBeenCalled();
    });

    it("search should call searchInFields for playlists and songs and generateLists", () => {
      const searchSpy = jest.spyOn(library, "searchInFields").mockImplementation(() => true);
      const generateListsSpy = jest.spyOn(library, "generateLists").mockImplementation(() => {});

      const searchSources = {
        playlists: [{ name: "p1", description: "d1" }, { name: "p2", description: "d2" }],
        songs: [{ name: "Bounce", artist: "Coma-Media", genre: "Electronic" }]
      }
      const expectedSearchCalls = searchSources.playlists.length + searchSources.songs.length;
      const searchInput = document.getElementById("search-input");
      searchInput.value = "co";

      library.search(searchInput, searchSources, false);

      expect(searchSpy).toHaveBeenCalledTimes(expectedSearchCalls);
      expect(generateListsSpy).toHaveBeenCalled();
    });

    it("search should call generateLists with correct filtered lists", () => {
      // All playlists will match the search function
      const searchSpy = jest.spyOn(library, "searchInFields").mockImplementation(() => true);
      const generateListsSpy = jest.spyOn(library, "generateLists").mockImplementation(() => {});

      const searchSources = {
        playlists: [{ name: "p1", description: "d1" }, { name: "p2", description: "d2" }],
        songs: [{ name: "Bounce", artist: "Coma-Media", genre: "Electronic" }]
      }
      const expectedSearchCalls = searchSources.playlists.length + searchSources.songs.length;
      const searchInput = document.getElementById("search-input");
      searchInput.value = "co";

      library.search(searchInput, searchSources, false);

      expect(searchSpy).toHaveBeenCalledTimes(expectedSearchCalls);
      expect(generateListsSpy).toHaveBeenCalledWith(searchSources.playlists, searchSources.songs);
    });
  });
});
