import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let schema: z.ZodTypeAny | null = null;

  const methodKey = req.method.toUpperCase();
  const pathKey = req.route?.path || "";

  if (pathKey == "/signup" && methodKey == "POST") {
    schema = signUpSchema;
  } else if (pathKey == "/signin" && methodKey == "POST") {
    schema = signInSchema;
  } else if (pathKey == "/password-update" && methodKey == "PATCH") {
    schema = updatePasswordSchema;
  }

  if (!schema) return next();

  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Données invalides";
    return res.status(400).json({ message });
  }

  req.body = parsed.data;

  next();
};

const signUpSchema = z
  .object({
    email: z.email("Format d'email invalide"),
    pseudo: z.string().min(3, "Pseudo trop court (3 caractères min)"),
    password: z
      .string({ error: "Mot de passe requis" })
      .min(6, "Mot de passe trop court (6 caractères min)"),
    passwordVerify: z.string({
      error: "Confirmation du mot de passe requise",
    }),
  })
  .refine((data) => data.password === data.passwordVerify, {
    message: "Confirmation du mot de passe erronée",
    path: ["passwordVerify"],
  });

const signInSchema = z.object({
  email: z.email("Format d'email invalide"),
  password: z.string({ error: "Mot de passe requis" }),
});

const updatePasswordSchema = z
  .object({
    currentPassword: z.string({
      error: "Mot de passe actuel requis",
    }),
    newPassword: z
      .string({ error: "Nouveau mot de passe requis" })
      .min(6, "Nouveau mot de passe trop court (6 caractères min)"),
    newPasswordVerify: z.string({
      error: "Confirmation du nouveau mot de passe requise",
    }),
  })
  .refine((d) => d.newPassword === d.newPasswordVerify, {
    message: "Confirmation du nouveau mot de passe erronée",
    path: ["newPasswordVerify"],
  });
