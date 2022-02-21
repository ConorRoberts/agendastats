import UserDocument from "@typedefs/UserDocument";
import getNewUser from "@utils/getNewUser";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

/**
 * Hook that returns the current user as a document from firestore
 * @returns {[UserDocument, boolean]}
 */
const useAuth = (): [UserDocument | null, boolean] => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firebaseAuth = getAuth();
    const db = getFirestore();

    firebaseAuth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        const ref = doc(db, "users", user.uid);
        const userData = getNewUser();

        userData.displayName = user.displayName;
        userData.email = user.email;
        userData.phoneNumber = user.phoneNumber;
        userData.uid = user.uid;

        setAuth(userData);

        await setDoc(ref, userData, { merge: true });
      }
      setLoading(false);
    });
  }, []);

  return [auth, loading];
};

export default useAuth;