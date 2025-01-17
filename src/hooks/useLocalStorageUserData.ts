import { useContext, useEffect } from "react";
import { UserDataContext } from "../utils/UserDataContext";

export default function useLocalStorageUserData() {
  const { userData, setUserData } = useContext(UserDataContext);
  useEffect(() => {
    if (userData === null) {
      const savedData: string | null = localStorage.getItem("data");
      setUserData(savedData === null ? null : JSON.parse(savedData));
    }
  }, []);

  return { userData, setUserData };
}
