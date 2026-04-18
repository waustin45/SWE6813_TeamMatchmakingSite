import UserDataInterface from "./userDataInterface";

type UserDataReturn =
  | { success: true; data: UserDataInterface }
  | { success: false; error: string; data: UserDataInterface | null };

export default UserDataReturn;