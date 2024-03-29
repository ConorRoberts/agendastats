import { getAuth, User } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

/**
 * Hook that returns the current user as a document from firestore
 * @returns {[User, boolean]}
 */
const useAuth = (): [User | null, boolean] => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firebaseAuth = getAuth();
    const db = getFirestore();

    firebaseAuth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        const ref = doc(db, "user-roles", user.uid);
        const roleDoc = await getDoc(ref);
        if (!roleDoc.exists()) {
          await setDoc(ref, { role: "user" });
        }
        setAuth(user);
      }else{
        setAuth(null);
      }
      setLoading(false);
    });
  }, []);

  return [auth, loading];
};

export default useAuth;
