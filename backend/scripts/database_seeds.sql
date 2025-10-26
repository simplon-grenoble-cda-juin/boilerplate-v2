BEGIN;

-- ORDRE D’INSERTION
-- game -> team -> user -> token -> tournament -> team_tournament -> match

-- JEUX
INSERT INTO public.game (id, name, genre) VALUES
  (1, 'League of Legends', 'MOBA'),
  (2, 'Counter Strike 2',  'FPS'),
  (3, 'Rocket League',     'Sports');

-- EQUIPES
INSERT INTO public.team (id, name, org_city, founded_year) VALUES
  (1, 'Blue Fox',     'Paris',     2018),
  (2, 'Crimson Owls', 'Lyon',      2019),
  (3, 'Silver Waves', 'Marseille', 2020);

-- UTILISATEURS
INSERT INTO public."user"
  (id, email, password_hash, created_at, pseudo, team_id)
VALUES
  -- Comptes techniques
  (1, 'admin@example.com',  'hashed_password_admin',  '2025-01-10 10:00:00', 'admin', NULL),
  (2, 'coach@example.com',  'hashed_password_coach',  '2025-02-05 15:30:00', 'coach', NULL),
  (3, 'viewer@example.com', 'hashed_password_viewer', '2025-03-12 09:45:00', 'viewer', NULL),

  -- Joueurs
  (4, 'kaze@example.com',   'hashed_password_kaze',   '2025-05-20 10:00:00', 'Kaze',  1),
  (5, 'nova@example.com',   'hashed_password_nova',   '2025-05-20 10:05:00', 'NoVa',  1),
  (6, 'rex@example.com',    'hashed_password_rex',    '2025-05-20 10:10:00', 'Rex',    2),
  (7, 'mira@example.com',   'hashed_password_mira',   '2025-05-20 10:15:00', 'Mira', 2),
  (8, 'axl@example.com',    'hashed_password_axl',    '2025-05-20 10:20:00', 'AxL',     3),
  (9, 'yumi@example.com',   'hashed_password_yumi',   '2025-05-20 10:25:00', 'Yumi',       3);

-- TOKENS
INSERT INTO public.token (id, user_id, token_hash, created_at, expires_at) VALUES
  (1, 1, '9f1ab2c3d4e5f6789a0b1c2d3e4f56789f1ab2c3d4e5f6789a0b1c2d3e4f5678',  '2025-06-15 10:30:00', '2025-06-15 22:30:00'),
  (2, 2, '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd',  '2025-07-01 08:00:00', '2025-07-01 20:00:00'),
  (3, 3, 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210','2025-07-10 18:45:00', '2025-07-11 06:45:00');

-- TOURNOIS
INSERT INTO public.tournament (id, name, game_id, start_date, end_date, location) VALUES
  (1, 'Hexa Cup Summer', 1, '2025-06-10', '2025-06-15', 'Paris'),
  (2, 'Aquila Masters',  2, '2025-07-05', '2025-07-07', 'Lyon'),
  (3, 'Riviera Open',    3, '2025-08-20', '2025-08-21', 'Nice');

-- EQUIPES PAR TOURNOI
INSERT INTO public.team_tournament (id, team_id, tournament_id, seed) VALUES
  (1, 1, 1, 1),
  (2, 2, 1, 2),
  (3, 1, 2, 2),
  (4, 3, 2, 1),
  (5, 2, 3, 1),
  (6, 3, 3, 2);

-- MATCHS
INSERT INTO public.match (id, tournament_id, game_id, match_date, team1_id, team2_id, team1_score, team2_score, best_of) VALUES
  (1, 1, 1, '2025-06-12 18:00:00', 1, 2, 2, 1, 3),
  (2, 2, 2, '2025-07-06 16:00:00', 3, 1, 2, 0, 3),
  (3, 3, 3, '2025-08-20 14:00:00', 2, 3, 3, 2, 5);

-- SYNCHRONISATION DES SEQUENCES
SELECT pg_catalog.setval('public.game_id_seq', 3, true);
SELECT pg_catalog.setval('public.team_id_seq', 3, true);
SELECT pg_catalog.setval('public.user_id_seq', 9, true);
SELECT pg_catalog.setval('public.token_id_seq', 3, true);
SELECT pg_catalog.setval('public.tournament_id_seq', 3, true);
SELECT pg_catalog.setval('public.team_tournament_id_seq', 6, true);
SELECT pg_catalog.setval('public.match_id_seq', 3, true);

COMMIT;
