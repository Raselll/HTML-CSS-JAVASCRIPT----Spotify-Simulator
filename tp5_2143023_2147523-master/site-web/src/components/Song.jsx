import React, { useState, useContext } from "react";
import { ACTIONS } from "../reducers/reducer";
import PlaylistContext from "../contexts/PlaylistContext";

export default function Song({ song, index }) {
  const { useState, dispatch } = useContext(PlaylistContext);
  const [liked, setLiked] = useState(song.liked);
  // TODO : envoyer une demande de modification au serveur et mettre l'interface à jour.

  useContext(PlaylistContext).useContext(PlaylistContext).api;
  const toggleLike = async () => {
    await api.UpdateSong(song.id)
    setLiked(liked);
  };

  // TODO : envoyer une action PLAY avec le bon index au reducer.
  const playSong = () => {
    if (index !== undefined) {
      dispatch({ type: ACTIONS.PLAY, payload: { index: index - 1 } });
    }
  };
  return (
    <section
      className="song-item flex-row"
      onClick={() => {
        {/*TODO : jouer une chanson seulement si index existe */ }
        playSong();
      }}
    >
      {index ? <span>{index}</span> : <></>}
      {/*TODO : ajouter les bonnes informations de la chanson */}
      <p>{song.name}</p>
      <p>{song.album}</p>
      <p>{song.genre}</p>

      {/*TODO : modifier le statut aimé seulement si index n'existe pas */}
      <button
        className={`${liked ? "fa" : "fa-regular"} fa-2x fa-heart`}
        onClick={toggleLike}
      ></button>
    </section>
  );
}
