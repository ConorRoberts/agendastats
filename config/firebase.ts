const devConfig = {
  apiKey: "AIzaSyB1KOtQ0OEHRIEB0-Dy6-my0qbcgY1A_dU",
  authDomain: "agendastats-8e818.firebaseapp.com",
  projectId: "agendastats-8e818",
  storageBucket: "agendastats-8e818.appspot.com",
  messagingSenderId: "1013360336757",
  appId: "1:1013360336757:web:6afb0b7d46f1d300be7d3c",
  measurementId: "G-Z7W11DGNMJ"
};

const prodConfig = {};

export default process.env.NODE_ENV === "production" ? devConfig : devConfig;
