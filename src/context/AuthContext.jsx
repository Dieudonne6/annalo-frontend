import { createContext, useContext, useEffect, useState } from "react";

import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("annalo_access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .fetchMe()
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem("annalo_access_token");
        localStorage.removeItem("annalo_refresh_token");
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(phone, password) {
    const { data } = await authApi.login(phone, password);
    localStorage.setItem("annalo_access_token", data.access);
    localStorage.setItem("annalo_refresh_token", data.refresh);
    const me = await authApi.fetchMe();
    setUser(me.data);
    return me.data;
  }

  async function register(payload) {
    await authApi.register(payload);
    return login(payload.phone, payload.password);
  }

  function logout() {
    localStorage.removeItem("annalo_access_token");
    localStorage.removeItem("annalo_refresh_token");
    setUser(null);
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    isTeamMember: Boolean(user?.team_role && user.team_role !== "none"),
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return ctx;
}

// TODO (Claude Code): brancher ici l'ouverture automatique de modal-auth
// quand une requête API renvoie 401 en dehors du refresh (session vraiment
// expirée), pour que l'utilisateur se reconnecte sans perdre son contexte.
