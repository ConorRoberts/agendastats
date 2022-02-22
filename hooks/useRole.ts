import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

/**
 * Hook that returns the current user as a document from firestore
 * @returns {[string, boolean]}
 */
const useRole = (): [string, boolean] => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firebaseAuth = getAuth();
    const db = getFirestore();

    firebaseAuth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        const ref = doc(db, "user-roles", user.uid);
        const roleDoc = await getDoc(ref);
        setRole(roleDoc.data().role);
      } else {
        setRole("user");
      }
      setLoading(false);
    });
  }, []);

  return [role, loading];
};

export default useRole;
