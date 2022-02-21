export default interface UserDocument {
    displayName: string;
    photoURL: string;
    uid: string;
    email: string;
    phoneNumber: string;
    role: "user" | "admin";
    createdAt: any;
    updatedAt: any;
}