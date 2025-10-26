import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../../types/Types";
import { useApiFetch } from "../hooks/useApiFetch";

interface AuthContext {
  user: User | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
  handleLogOut: () => void;
  isLoading: boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContext | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [initialized, setInitialized] = useState(false);

  const { fetchApi, isLoading } = useApiFetch<User>();

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetchApi({
          method: "GET",
          path: "/auth/profile",
          credentials: "include",
        });

        if (res && res.data) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setInitialized(true);
      }
    };

    init();
  }, []);

  const handleLogOut = async () => {
    await fetchApi({
      method: "GET",
      path: "/auth/logout",
      credentials: "include",
    });
    setUser(null);
  };

  const contextValue = {
    user,
    setUser,
    handleLogOut,
    isLoading,
    initialized,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "🔄 AuthContext doit être utilisé dans AuthContextProvider"
    );
  }
  return context;
};
