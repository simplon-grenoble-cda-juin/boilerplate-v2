import { useEffect, useState } from "react";

export const useFetcher = <T>(path: string) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setIsError(false);
      setErrorMsg(undefined);

      try {
        const response = await fetch(import.meta.env.VITE_API_URL + path);

        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();

        setData(data);
      } catch (error) {
        setIsError(true);
        setErrorMsg(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [path]);

  return { data, isLoading, isError, errorMsg };
};
