import StorageManager from "./storageManager.js";

class Library {
  constructor (storageManager) {
    this.storageManager = storageManager;
  }

  /**
   * TODO
   * Génère le code HTML pour l'affichage des playlists et chansons disponibles
   * @param {Object[]} playlists liste de playlists à afficher
   * @param {Object[]} songs liste de chansons à afficher
   */
  generateLists (playlists, songs) {
    const playlistContainer = document.getElementById("playlist-container");
    playlistContainer.innerHTML = "";
    // TODO : générer le HTML pour les playlists
    playlists.forEach(playlist => {
      playlistContainer.appendChild(this.buildPlaylistItem(playlist));
    });
    // TODO : générer le HTML pour les chansons
    const songContainer = document.getElementById("song-container");
    songContainer.innerHTML = "";
    for (const elem of songs) {
      songContainer.appendChild(this.buildSongItem(elem))
    }
  }

  /**
   * TODO
   * Construit le code HTML qui représente l'affichage d'une playlist
   * @param {Object} playlist playlist à utiliser pour la génération du HTML
   * @returns {HTMLAnchorElement} élément <a> qui contient le HTML de l'affichage pour une playlist
   */
  buildPlaylistItem (playlist) {
    const playlistItem = document.createElement("a");
    const link = `./playlist.html?id=${playlist.id}`;
    playlistItem.setAttribute("href", link);
    playlistItem.classList.add("playlist-item", "flex-column");

    const divElement = document.createElement("div");
    divElement.className = "playlist-preview";

    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", playlist.thumbnail);

    const iElement = document.createElement("i");
    iElement.className = "fa fa-2x fa-play-circle hidden playlist-play-icon";
    divElement.appendChild(imgElement);
    divElement.appendChild(iElement);

    const pFirstElement = document.createElement("p");
    const pFirstElementText = document.createTextNode(playlist.name);
    pFirstElement.appendChild(pFirstElementText);

    const pSecondElement = document.createElement("p");
    const pSecondElementText = document.createTextNode(playlist.description);
    pSecondElement.appendChild(pSecondElementText);

    playlistItem.appendChild(divElement);
    playlistItem.appendChild(pFirstElement);
    playlistItem.appendChild(pSecondElement);

    return playlistItem;
  }

  /**
   * TODO
   * Construit le code HTML qui représente l'affichage d'une chansons
   * @param {Object} song chanson à utiliser pour la génération du HTML
   * @returns {HTMLDivElement} élément <div> qui contient le HTML de l'affichage pour une chanson
   */
  buildSongItem = function (song) {
    const songItem = document.createElement("div");
    songItem.classList.add("song-item", "flex-row");
    const pFirstElement = document.createElement("p");
    const pFirstElementText = document.createTextNode(song.name);
    pFirstElement.appendChild(pFirstElementText);

    const pSecondElement = document.createElement("p");
    const pSecondElementText = document.createTextNode(song.genre);
    pSecondElement.appendChild(pSecondElementText);

    const pThirdElement = document.createElement("p");
    const pThirdElementText = document.createTextNode(song.artist);
    pThirdElement.appendChild(pThirdElementText);

    const buttonElement = document.createElement("button");
    if (song.liked) {
      buttonElement.classList.add("fa", "fa-2x", "fa-heart");
    } else {
      buttonElement.classList.add("fa-regular", "fa-2x", "fa-heart");
    }
    // TODO : gérer l'événement "click". Modifier l'image du bouton et mettre à jour l'information dans LocalStorage
    buttonElement.addEventListener('click', () => {
      if (song.liked) {
        buttonElement.classList.replace("fa", "fa-regular");
        song.liked = false;
      } else {
        buttonElement.classList.replace("fa-regular", "fa");
        song.liked = true;
      }

      this.storageManager.replaceItem("songs", song)
    })
    songItem.appendChild(pFirstElement);
    songItem.appendChild(pSecondElement);
    songItem.appendChild(pThirdElement);
    songItem.appendChild(buttonElement);
    return songItem;
  };
}
window.onload = () => {
  const storageManager = new StorageManager();
  const library = new Library(storageManager);

  storageManager.loadAllData();
  // TODO : Récupérer les playlists et les chansons de LocalStorage et bâtir le HTML de la page
  library.generateLists(storageManager.getData(storageManager.STORAGE_KEY_PLAYLISTS), storageManager.getData(storageManager.STORAGE_KEY_SONGS));
};
