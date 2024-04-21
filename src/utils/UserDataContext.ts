import { createContext } from "react";

export const UserDataContext = createContext({
  userData: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserData: () => {},
} as IUserDataContext);

export interface IUserData {
  fname: string;
  lname: string;
  email: string;
  role: string;
  user_id: string;
  created_at: string;
}

export interface IUserDataContext {
  userData: IUserData | null;
  setUserData: React.Dispatch<React.SetStateAction<IUserData | null>>;
}
