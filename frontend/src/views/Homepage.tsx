import { useFetcher } from "../core/useFetcher";
import type { Player, PlayersResponse } from "../types/Types";

export const Homepage = () => {
  const { data, isLoading, isError, errorMsg } =
    useFetcher<PlayersResponse>("/players");

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur : {errorMsg}</p>;
  if (!data) return <p>Aucune donnée trouvée.</p>;

  const players: Player[] = data ? JSON.parse(data.players) : [];

  return (
    <main>
      <h1>Liste des joueurs</h1>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            <strong>{player.nickname}</strong> — {player.full_name} (
            {player.country})
          </li>
        ))}
      </ul>
    </main>
  );
};
