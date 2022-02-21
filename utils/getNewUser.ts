import UserDocument from "@typedefs/UserDocument";

const getNewUser = (): UserDocument => {
  return {
    email: null,
    displayName: null,
    photoURL: null,
    uid: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "user",
    phoneNumber: null
  };
};

export default getNewUser;