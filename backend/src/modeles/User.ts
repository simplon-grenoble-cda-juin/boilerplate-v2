import { UserDbRow } from "@src/types/Database";

/**
 * Représente un utilisateur persisté ou en cours de création.
 */
export default class User {
  /** Identifiant en base (optionnel tant que l'utilisateur n'est pas inséré) */
  protected id?: number;
  protected email: string;
  protected pseudo: string;
  protected password_hash: string;
  protected created_at: string;

  /**
   * Crée une instance de User.
   * @param email - Adresse email de l'utilisateur
   * @param pseudo - Pseudo de l'utilisateur
   * @param password_hash - Hash du mot de passe
   * @param created_at - Date de création ISO (générée si absente)
   * @param id - Identifiant en base (optionnel)
   */
  constructor(
    email: string,
    pseudo: string,
    password_hash: string,
    created_at?: string,
    id?: number
  ) {
    this.id = id;
    this.email = email;
    this.pseudo = pseudo;
    this.password_hash = password_hash;
    this.created_at = created_at ?? new Date().toISOString();
  }

  /**
   * Construit un User à partir d'une ligne retournée par la base de données.
   * @param row - Enregistrement contenant les colonnes attendues
   */
  static fromRow = (row: UserDbRow): User => {
    return new User(
      row.email,
      row.pseudo,
      row.password_hash,
      row.created_at,
      row.id
    );
  };

  /**
   * Sérialise l'utilisateur pour l'envoyer en réponse HTTP.
   * N'expose pas le hash du mot de passe.
   */
  serialize = (): Record<string, string | number | undefined> => {
    return {
      email: this.email,
      pseudo: this.pseudo,
      created_at: this.created_at,
    };
  };

  setId = (id: number): void => {
    this.id = id;
  };

  getId = (): number | undefined => this.id;

  getEmail = (): string => this.email;

  getPseudo = (): string => this.pseudo;

  getPasswordHash = (): string => this.password_hash;

  getCreatedAt = (): string => this.created_at;
}
