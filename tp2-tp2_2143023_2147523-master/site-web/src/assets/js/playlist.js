import StorageManager from "./storageManager.js";
import { formatTime } from "./utils.js";
import { SKIP_TIME, SHORTCUTS } from "./consts.js";
import Player from "./player.js";

export class PlayListManager {
  constructor (player) {
    /**
     * @type {Player}
     */
    this.player = player;
    this.shortcuts = new Map();
  }

  /**
   * TODO
   * Charge les chansons de la playlist choisie et construit dynamiquement le HTML pour les éléments de chansons
   * @param {StorageManager} storageManager gestionnaire d'accès au LocalStorage
   * @param {string} playlistId identifiant de la playlist choisie
   */
  loadSongs (storageManager, playlistId) {
    const playlist = storageManager.getItemById(
      storageManager.STORAGE_KEY_PLAYLISTS,
      playlistId
    );
    if (!playlist) return;

    // TODO : Changer l'image et le titre de la page en fonction de la playlist choisie
    document.getElementById("playlist-img").setAttribute("src", playlist.thumbnail);
    document.getElementById("playlist-title").textContent = playlist.name;
    // TODO : Récupérer les chansons de la playlist et construire le HTML pour leur représentation
    const songs = playlist.songs.map((song) => {
      return storageManager.getItemById(storageManager.STORAGE_KEY_SONGS, song.id);
    })
    this.player.loadSongs(songs);
    const songElement = document.getElementById("song-container");
    songElement.innerHTML = "";
    for (let i = 0; i < songs.length; i++) {
      songElement.appendChild(this.buildSongItem(songs[i], i));
    }
  }

  /**
   * TODO
   * Construit le code HTML pour représenter une chanson
   * @param {Object} song la chansons à représenter
   * @param {number} index index de la chanson
   * @returns {HTMLDivElement} le code HTML dans un élément <div>
   */
  buildSongItem (song, index) {
    const songItem = document.createElement("div");
    songItem.classList.add("song-item", "flex-row");

    const spanElement = document.createElement("span");
    spanElement.textContent = index + 1;

    const firstElementP = document.createElement("p");
    firstElementP.textContent = song.name;

    const secondElementP = document.createElement("p");
    secondElementP.textContent = song.genre;

    const thirdElementP = document.createElement("p");
    thirdElementP.textContent = song.artist;

    const iconElement = document.createElement("i");
    if (song.liked) {
      iconElement.classList.add("fa", "fa-2x", "fa-heart");
    } else {
      iconElement.classList.add("fa-regular", "fa-2x", "fa-heart");
    }
    songItem.appendChild(spanElement);
    songItem.appendChild(firstElementP);
    songItem.appendChild(secondElementP);
    songItem.appendChild(thirdElementP);
    songItem.appendChild(iconElement);
    // TODO : gérer l'événement "click" et jouer la chanson après un click
    songItem.addEventListener('click', () => { this.playAudio(index); });

    return songItem;
  }

  /**
   * TODO
   * Joue une chanson en fonction de l'index et met à jour le titre de la chanson jouée
   * @param {number} index index de la chanson
   */
  playAudio (index) {
    const playButton = document.getElementById("play");
    this.player.playAudio(index);
    this.setCurrentSongName();
    // TODO : modifier l'icône du bouton. Ajoute la classe 'fa-pause' si la chanson joue, 'fa-play' sinon
    if (this.player.audio.paused) {
      playButton.classList.replace("fa-play", "fa-pause");
    } else {
      playButton.classList.replace("fa-pause", "fa-play");
    }
  }

  /**
   * TODO
   * Joue la prochaine chanson et met à jour le titre de la chanson jouée
   */
  playPreviousSong () {
    this.audio.playPreviousSong();
    this.setCurrentSongName();
  }

  /**
   * TODO
   * Joue la chanson précédente et met à jour le titre de la chanson jouée
   */
  playNextSong () {
    this.audio.playNextSong();
    this.setCurrentSongName();
  }

  /**
   * TODO
   * Met à jour le titre de la chanson jouée dans l'interface
   */
  setCurrentSongName () {
    const songName = document.getElementById("now-playing");
    songName.textContent = "On joue: " + this.player.currentSong.name;
  }

  /**
   * Met à jour la barre de progrès de la musique
   * @param {HTMLSpanElement} currentTimeElement élément <span> du temps de la chanson
   * @param {HTMLInputElement} timelineElement élément <input> de la barre de progrès
   * @param {HTMLSpanElement} durationElement élément <span> de la durée de la chanson
   */
  timelineUpdate (currentTimeElement, timelineElement, durationElement) {
    const position =
      (100 * this.player.audio.currentTime) / this.player.audio.duration;
    timelineElement.value = position;
    currentTimeElement.textContent = formatTime(this.player.audio.currentTime);
    if (!isNaN(this.player.audio.duration)) {
      durationElement.textContent = formatTime(this.player.audio.duration);
    }
  }

  /**
   * TODO
   * Déplacement le progrès de la chansons en fonction de l'attribut 'value' de timeLineEvent
   * @param {HTMLInputElement} timelineElement élément <input> de la barre de progrès
   */
  audioSeek (timelineElement) {
    this.player.audioSeek(timelineElement.value);
  }

  /**
   * TODO
   * Active ou désactive le son
   * Met à jour l'icône du bouton et ajoute la classe 'fa-volume-mute' si le son ferme ou 'fa-volume-high' si le son est ouvert
   */
  muteToggle () {
    this.player.muteToggle();
    const muteIcon = document.getElementById("mute");
    if (this.player.audio.muted) {
      muteIcon.classList.replace("fa-volume-high", "fa-volume-mute");
    } else {
      muteIcon.classList.replace("fa-volume-mute", "fa-volume-high");
    }
  }

  /**
   * TODO
   * Active ou désactive l'attribut 'shuffle' de l'attribut 'player'
   * Met à jour l'icône du bouton et ajoute la classe 'control-btn-toggled' si shuffle est activé, retire la classe sinon
   * @param {HTMLButtonElement} shuffleButton élément <button> de la fonctionnalité shuffle
   */
  shuffleToggle (shuffleButton) {
    this.player.shuffleToggle();
    if (this.player.shuffle) {
      shuffleButton.classList.add("control-btn-toggled");
    } else {
      shuffleButton.classList.remove("control-btn-toggled");
    }
  }

  /**
   * Ajoute delta secondes au progrès de la chanson en cours
   * @param {number} delta temps en secondes
   */
  scrubTime (delta) {
    this.player.scrubTime(delta);
  }

  /**
   * TODO
   * Configure la gestion des événements
   */
  bindEvents () {
    const currentTime = document.getElementById("timeline-current");
    const duration = document.getElementById("timeline-end");
    const timeline = document.getElementById("timeline");
    this.player.audio.addEventListener("timeupdate", () => {
      this.timelineUpdate(currentTime, timeline, duration);
    });

    timeline.addEventListener("input", () => {
      this.audioSeek(timeline);
    });

    // TODO : gérer l'événement 'ended' sur l'attribut 'audio' du 'player' et jouer la prochaine chanson automatiquement
    this.player.audio.addEventListener('ended', () => {
      this.playNextSong();
    });
    // TODO : gérer l'événement 'click' sur le bon bouton et mettre la chanson en pause/enlever la pause
    const playButton = document.getElementById("play");
    playButton.addEventListener('click', () => {
      this.playAudio(-1);
    })
    // TODO : gérer l'événement 'click' sur le bon bouton et fermer/ouvrir le son
    const muteButton = document.getElementById("mute");
    muteButton.addEventListener('click', () => {
      this.muteToggle();
    });

    // TODO : gérer l'événement 'click' sur le bon bouton et jouer la chanson précédente
    const previousButton = document.getElementById("previous");
    previousButton.addEventListener('click', () => {
      this.playPreviousSong();
    })
    // TODO : gérer l'événement 'click' sur le bon bouton et jouer la chanson suivante
    const nextButton = document.getElementById("next");
    nextButton.addEventListener('click', () => {
      this.playNextSong();
    })
    // TODO : gérer l'événement 'click' sur le bon bouton et activer/désactiver le mode 'shuffle'
    const shuffleButton = document.getElementById("shuffle");
    shuffleButton.addEventListener('click', () => {
      this.shuffleToggle(shuffleButton);
    })
  }

  /**
   * Configure les raccourcis et la gestion de l'événement 'keydown'
   */
  bindShortcuts () {
    this.shortcuts.set(SHORTCUTS.GO_FORWARD, () => this.scrubTime(SKIP_TIME));
    this.shortcuts.set(SHORTCUTS.GO_BACK, () => this.scrubTime(-SKIP_TIME));
    this.shortcuts.set(SHORTCUTS.PLAY_PAUSE, () => this.playAudio());
    this.shortcuts.set(SHORTCUTS.NEXT_SONG, () => this.playNextSong());
    this.shortcuts.set(SHORTCUTS.PREVIOUS_SONG, () => this.playPreviousSong());
    this.shortcuts.set(SHORTCUTS.MUTE, () => this.muteToggle());

    document.addEventListener("keydown", (event) => {
      if (this.shortcuts.has(event.key)) {
        const command = this.shortcuts.get(event.key);
        command();
      }
    });
  }
}

window.onload = () => {
  const storageManager = new StorageManager();
  storageManager.loadAllData();

  // TODO : récupérer l'identifiant à partir de l'URL
  // Voir l'objet URLSearchParams
  const player = new Player();
  const playlistManager = new PlayListManager(player);

  const queryString = document.location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("id");

  // TODO : configurer la gestion des événements et des raccourcis
  playlistManager.bindEvents();
  playlistManager.bindShortcuts();
  // TODO : charger la playlist
  playlistManager.loadSongs(storageManager, id)
};
