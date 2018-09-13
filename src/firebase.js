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

// var config = {
//   apiKey: "AIzaSyDXqQmPpbyQj6ZSkaXmaTgBPIKmXGzs4Yk",
//   authDomain: "the-financial-report-card.firebaseapp.com",
//   databaseURL: "https://the-financial-report-card.firebaseio.com",
//   projectId: "the-financial-report-card",
//   storageBucket: "the-financial-report-card.appspot.com",
//   messagingSenderId: "663221087614"
// };
// firebase.initializeApp(config);

export default firebase;
