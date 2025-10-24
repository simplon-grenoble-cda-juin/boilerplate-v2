import { useState } from "react";
import type { ApiResponse } from "../../types/Types";

export type ApiFetchOptions = {
  method: "GET" | "POST" | "PATCH";
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  delai?: number;
};

export const useApiFetch = <TResponse>() => {
  const [result, setResult] = useState<ApiResponse<TResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  const fetchApi = async ({
    method,
    path,
    body,
    headers,
    credentials,
    delai,
  }: ApiFetchOptions) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMsg(undefined);

    // Faux délai de chargement
    if (delai) await new Promise((resolve) => setTimeout(resolve, delai));

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...headers,
        },
        credentials,
      };

      if (body && method !== "GET") {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(
        import.meta.env.VITE_API_URL + path,
        fetchOptions
      );

      const json = (await response.json()) as ApiResponse<TResponse>;

      if (!response.ok) throw new Error(json.message);

      setResult(json);

      return json;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);

      setResult(null);
      setIsError(true);
      setErrorMsg(msg);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchApi, result, isLoading, isError, errorMsg };
};
