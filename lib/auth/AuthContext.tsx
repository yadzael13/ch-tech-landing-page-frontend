"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ApiError, apiFetch } from "@/lib/api/client";

interface RouteErrorBody {
  error: { code: string; message: string };
}

interface AccessTokenBody {
  access_token: string;
}

async function requestAccessToken(
  path: string,
  init?: RequestInit,
): Promise<string> {
  const response = await fetch(path, {
    ...init,
    method: "POST",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body: unknown = await response.json();

  if (!response.ok) {
    const errorBody = body as RouteErrorBody;
    throw new ApiError(
      errorBody.error.message,
      errorBody.error.code,
      response.status,
    );
  }

  return (body as AccessTokenBody).access_token;
}

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authedFetch: <T>(path: string, init?: RequestInit) => Promise<T>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Coalesce concurrent refresh attempts (mount + a 401 retry racing) into
  // one in-flight request instead of burning the single-use refresh token
  // twice.
  const refreshPromiseRef = useRef<Promise<string> | null>(null);

  const refresh = useCallback(async (): Promise<string> => {
    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = requestAccessToken(
        "/api/auth/refresh",
      ).finally(() => {
        refreshPromiseRef.current = null;
      });
    }
    const token = await refreshPromiseRef.current;
    setAccessToken(token);
    return token;
  }, []);

  useEffect(() => {
    // Silent refresh on mount: the only client-side evidence of a session is
    // the httpOnly cookie, which JS can't read directly — asking the backend
    // to redeem it is the only way to know if the visitor is signed in.
    refresh()
      .catch(() => setAccessToken(null))
      .finally(() => setIsLoading(false));
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const token = await requestAccessToken("/api/auth/login", {
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(token);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    }).catch(() => undefined);
    setAccessToken(null);
  }, [accessToken]);

  const authedFetch = useCallback(
    async function authedFetchImpl<T>(
      path: string,
      init?: RequestInit,
    ): Promise<T> {
      const attempt = (token: string | null) =>
        apiFetch<T>(path, {
          ...init,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...init?.headers,
          },
        });

      try {
        return await attempt(accessToken);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          const freshToken = await refresh();
          return attempt(freshToken);
        }
        throw error;
      }
    },
    [accessToken, refresh],
  );

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: accessToken !== null,
        login,
        logout,
        authedFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
