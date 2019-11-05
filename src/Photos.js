import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import PhotoCard from "./PhotoCard";
import AddPhoto from "./AddPhoto";
import { db, snapshotToArray } from "./firebase";

export default function Photos(props) {
  const [dialog_open, setDialogOpen] = useState(false);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(props.user.uid)
      .collection("album")
      .doc(props.match.params.album_id)
      .collection("photos")
      .onSnapshot(snapshot => {
        const updated_photos = snapshotToArray(snapshot);
        setPhotos(updated_photos);
      });

    return unsubscribe;
  }, [props]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        paddingLeft: 10,
        paddingTop: 10
      }}
    >
      {photos.map(p => {
        return <PhotoCard photo={p} />;
      })}
      <div>
        <Button
          color="secondary"
          variant="contained"
          style={{ marginTop: 10 }}
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          Add Photo
        </Button>
      </div>
      <AddPhoto
        open={dialog_open}
        onClose={() => {
          setDialogOpen(false);
        }}
        user={props.user}
        album_id={props.match.params.album_id}
      />
    </div>
  );
}
