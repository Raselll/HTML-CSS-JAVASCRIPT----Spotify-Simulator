import StorageManager from "./storageManager.js";

/**
 * TODO
 * Popule l'élément 'dataList' avec des éléments <option> en fonction des noms des chansons en paramètre
 * @param {HTMLDataListElement} dataList élément HTML à qui ajouter des options
 * @param {Object} songs liste de chansons dont l'attribut 'name' est utilisé pour générer les éléments <option>
 */
function buildDataList (dataList, songs) {
  dataList.innerHTML = "";
  // TODO : extraire le nom des chansons et populer l'élément dataList avec des éléments <option>
  songs.forEach(song => {
    const optionName = document.createElement("option");
    optionName.setAttribute("value", song.name);
    dataList.appendChild(optionName);
  });
}

/**
 * Permet de mettre à jour la prévisualisation de l'image pour la playlist
 */
function updateImageDisplay () {
  const imagePreview = document.getElementById("image-preview");
  imagePreview.src = URL.createObjectURL(this.files[0]);
}

/**
 * TODO
 * Ajoute le code HTML pour pouvoir ajouter une chanson à la playlist
 * Le code contient les éléments <label>, <input> et <button> dans un parent <div>
 * Le bouton gère l'événement "click" et retire le <div> généré de son parent
 * @param {Event} e événement de clic
 */
function addItemSelect (e) {
  // TODO : prévenir le comportement par défaut du bouton pour empêcher la soumission du formulaire
  e.preventDefault();
  // TODO : construire les éléments HTML nécessaires pour l'ajout d'une nouvelle chanson
  const songContainer = document.getElementById("song-list");

  const newSong = document.createElement("div");
  const labelElement = document.createElement("label");
  const index = songContainer.children.length - 1;
  const id = `songs-${index}`;
  labelElement.setAttribute("for", id);
  labelElement.textContent = `#${index + 2}`;
  const inputElement = document.createElement("input");
  inputElement.className = "song-input";
  inputElement.setAttribute("id", id);
  inputElement.setAttribute("type", "select");
  inputElement.setAttribute("list", "song-dataList");
  inputElement.setAttribute("required", true);
  const removeButton = document.createElement("button");
  removeButton.classList.add("fa", "fa-minus");
  newSong.appendChild(labelElement);
  newSong.appendChild(inputElement);
  newSong.appendChild(removeButton);

  songContainer.appendChild(newSong);
  // TODO : gérér l'événement "click" qui retire l'élément <div> généré de son parent
  removeButton.addEventListener('click', (e) => {
    songContainer.removeChild(songContainer.lastChild);
  });
}
/**
 * TODO
 * Génère un objet Playlist avec les informations du formulaire et le sauvegarde dans le LocalStorage
 * @param {HTMLFormElement} form élément <form> à traiter pour obtenir les données
 * @param {StorageManager} storageManager permet la sauvegarde dans LocalStorage
 */
async function createPlaylist (form, storageManager) {
  // TODO : récupérer les informations du formulaire
  // Voir la propriété "elements" https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements
  const elements = form.elements;
  const playlists = storageManager.getData(storageManager.STORAGE_KEY_PLAYLISTS);
  const playlistId = (playlists.length + 1).toString();
  const playlistName = elements["name"].value;
  const playlistDescription = elements["description"].value;
  const playlistImage = await getImageInput(elements["image"]);
  const playlistSongs = [];
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].nodeName === "INPUT" && elements[i].classList.contains("song-input")) {
      playlistSongs.push({ id: storageManager.getIdFromName(storageManager.STORAGE_KEY_SONGS, elements[i].value) });
    }
  }
  // TODO : créer un nouveau objet playlist et le sauvegarder dans LocalStorage
  const newPlaylist = {
    id: playlistId,
    name: playlistName,
    description: playlistDescription,
    thumbnail: playlistImage,
    songs: playlistSongs,
  };
  storageManager.addItem(storageManager.STORAGE_KEY_PLAYLISTS, newPlaylist);
}

/**
 * Fonction qui permet d'extraire une image à partir d'un file input
 * @param {HTMLInputElement} input champ de saisie pour l'image
 * @returns image récupérée de la saisie
 */
async function getImageInput (input) {
  if (input && input.files && input.files[0]) {
    const image = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(reader.result);
      reader.readAsDataURL(input.files[0]);
    });
    return image;
  }
}

window.onload = () => {
  // TODO : récupérer les éléments du DOM
  const imageInput = document.getElementById("image");
  const form = document.getElementById("playlist-form");

  const storageManager = new StorageManager();
  storageManager.loadAllData();
  const songs = storageManager.getData(storageManager.STORAGE_KEY_SONGS);

  const dataList = document.getElementById("song-dataList");
  // TODO : construire l'objet dataList
  buildDataList(dataList, songs);
  imageInput.addEventListener("change", updateImageDisplay);

  const addSongButton = document.getElementById("add-song-btn");
  // TODO : gérer l'événement "submit" du formulaire

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    createPlaylist(form, storageManager);
  });
  addSongButton.addEventListener('click', addItemSelect);
};
