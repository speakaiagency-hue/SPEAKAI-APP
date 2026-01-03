export interface User {
  id: string;
  email: string;
  name: string;
  status: "active" | "inactive";
  avatar?: string; // 🔑 opcional para suportar avatar
}

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
};

export const getUser = (): User | null => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string, user: User) => {
  try {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Erro ao salvar token:", error);
  }
};

export const clearAuth = () => {
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Erro ao limpar auth:", error);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken() && !!getUser();
};

/**
 * Retorna o header de autenticação para chamadas ao backend
 * Exemplo: { Authorization: "Bearer <token>" }
 */
export const getAuthHeader = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
