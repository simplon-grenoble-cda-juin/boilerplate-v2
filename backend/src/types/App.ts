// Représente un résultat d'échec d'une opération
export interface ResultFail<E = unknown> {
  success: false;
  message: string;
  data?: E;
}

// Représente un résultat de succès d'une opération
export interface ResultSuccess<S = unknown> {
  success: true;
  data: S;
  message?: string;
}

// Union pour typer le retour d'une opération (succès ou échec)
export type Result<S, E = unknown> = ResultSuccess<S> | ResultFail<E>;

// Représente la charge utile d'un refresh token
export interface AuthRefreshTokenPayload {
  sub: string;
}
