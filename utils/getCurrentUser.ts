import UserDocument from "@typedefs/UserDocument";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

/**
 * Gets current user from Firebase
 * @returns User document containing important data from auth and user document
 */
const getCurrentUser = async(): Promise<(UserDocument | null)> =>{
  const db = getFirestore();
  const auth = getAuth();

  try{
    const userDoc = await getDoc(doc(db, `users/${auth.currentUser.uid}`));
    
    if (userDoc.exists())
      return userDoc.data() as UserDocument;

    throw new Error("User document does not exist");

  }catch(error){
    return null;
  }
};

export default getCurrentUser;