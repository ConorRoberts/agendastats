// import getLocalStorage from '@utils/getLocalStorage';
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect } from "react";

const StateManager = () => {
  const firebaseAuth = getAuth();

  useEffect(() => {
    const db = getFirestore();

    // try {
    //     const { value } = getLocalStorage("darkMode");
    //     dispatch(toggleDarkMode(value));
    // } catch (e) {

    // }

    firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        const { displayName, photoURL, uid, email, phoneNumber } = user;
        const userData = {
          displayName,
          photoURL,
          uid,
          email,
          phoneNumber,
          role: "user"
        };

        const ref = doc(db, "users", user.uid);
        const userDoc = await getDoc(ref);

        if (userDoc.exists()) {
          // Doc exists, be conscious overwriting
          await setDoc(ref, { ...userDoc.data() });
        } else {
          // Doc doesn't exist. Continue with new data
          await setDoc(ref, userData);
        }

      }
    });

  }, [firebaseAuth]);

  return null;
};

export default StateManager; 
