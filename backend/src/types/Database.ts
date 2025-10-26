// Structure d'une ligne utilisateur en base
export interface UserDbRow {
  id?: number;
  email: string;
  pseudo: string;
  password_hash: string;
  created_at: string;
}

// Structure d'une ligne token en base
export interface TokenDbRow {
  id?: number;
  user_id: number;
  token_hash: string;
  expires_at: string;
  created_at: string;
}

// Structure d'une ligne équipe en base
export interface TeamDbRow {
  id?: number;
  name: string;
  org_city: string;
  founded_year: number;
}
