import { useEffect, useState } from "react";

export const Homepage = () => {
  const [envName, setEnvName] = useState<string>();

  useEffect(() => {
    const rawEnvName = import.meta.env.MODE;

    switch (rawEnvName) {
      case "dev":
        setEnvName("développement 🔧");
        break;
      case "test":
        setEnvName("test 🪲");
        break;
      case "preprod":
        setEnvName("pré-production 🔍");
        break;
      case "prod":
        setEnvName("production 🚀");
        break;
      default:
        setEnvName("inconnu 🤯");
        break;
    }
  }, [setEnvName]);

  return (
    <main>
      <h2>Bienvenue sur l'environnement de {envName}</h2>
    </main>
  );
};
