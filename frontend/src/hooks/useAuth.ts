import { useEffect, useState } from "react";

const AUTH_KEY = "auth_user";

export function useAuth() {
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_KEY);
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, user);
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  function login(username: string) {
    setUser(username);
  }

  function logout() {
    setUser(null);
  }

  return { user, login, logout };
}
