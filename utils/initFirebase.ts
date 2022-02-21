import { getApps, initializeApp } from "@firebase/app";
import firebaseConfig from "@config/firebase";

const initFirebase = () => {
  const apps = getApps();

  if (apps.length === 0) {
    return initializeApp(firebaseConfig);
  }


  return null;
};

export default initFirebase;