import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@material-ui/icons/Menu";
import { Link, Route } from "react-router-dom";
import { auth, db, snapshotToArray } from "./firebase";
import Photos from "./Photos";
import AddAlbum from "./AddAlbum";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export function App(props) {
  const [drawer_open, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dialog_open, setDialogOpen] = useState(false);
  const [albums, setAlbums] = useState([
    { id: 0, title: "Nature" },
    { id: 1, title: "Cities" }
  ]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
    });

    return unsubscribe;
  }, [props.history]);

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .collection("album")
        .onSnapshot(snapshot => {
          const updated_albums = snapshotToArray(snapshot);
          setAlbums(updated_albums);
        });
    }
  }, [user]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        alert(error.message);
      });
  };

  if (!user) {
    return <div />;
  }

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            style={{ flexGrow: 1, marginLeft: "30px" }}
          >
            My Albums
          </Typography>
          <Typography color="inherit" style={{ marginRight: "30px" }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        open={drawer_open}
        onClose={() => {
          setDrawerOpen(false);
        }}
      >
        <List component="nav">
          {albums.map(a => {
            return (
              <ListItem
                button
                to={"/app/album/" + a.id + "/"}
                component={Link}
                onClick={() => {
                  setDrawerOpen(false);
                }}
                key={a.id}
              >
                <ListItemText primary={a.name} />
              </ListItem>
            );
          })}
          <ListItem
            button
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            <ListItemText primary="Create new album" />
          </ListItem>
        </List>
      </Drawer>
      <AddAlbum
        open={dialog_open}
        onClose={() => {
          setDialogOpen(false);
        }}
        user={user}
      />
      <Route
        path="/app/album/:album_id/"
        render={routeProps => {
          return <Photos user={user} {...routeProps} />;
        }}
      />
    </div>
  );
}
