import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyBZd7Oj5hXLH2EvLoUgpbXyhyqxmGUfACU",
  authDomain: "album-6300a.firebaseapp.com",
  databaseURL: "https://album-6300a.firebaseio.com",
  projectId: "album-6300a",
  storageBucket: "album-6300a.appspot.com",
  messagingSenderId: "971308488451",
  appId: "1:971308488451:web:4261fb10376453c0e87b36"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
