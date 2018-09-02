import firebase from "firebase";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAmF2ArBSFPIH_kW29thQNC7aNEqPVretQ",
  authDomain: "project5-3d96f.firebaseapp.com",
  databaseURL: "https://project5-3d96f.firebaseio.com",
  projectId: "project5-3d96f",
  storageBucket: "project5-3d96f.appspot.com",
  messagingSenderId: "1003156347801"
};
firebase.initializeApp(config);

export default firebase;
