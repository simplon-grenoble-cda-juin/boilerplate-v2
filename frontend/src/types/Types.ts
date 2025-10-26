// API

export type ApiResponse<TData> = {
  message: string;
  data: TData;
};

// ENTITIES

export type User = {
  email: string;
  pseudo: string;
  created_at: string;
};
