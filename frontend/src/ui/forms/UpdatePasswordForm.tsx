import { Button } from "../components/button/Button";
import { useState, type ChangeEvent } from "react";

export interface UpdatePasswordForm {
  currentPassword: string;
  newPassword: string;
  newPasswordVerify: string;
}

interface UpdatePasswordFormProps {
  sendToApi: (formData: UpdatePasswordForm) => void;
}

const defaultValues: UpdatePasswordForm = {
  currentPassword: "",
  newPassword: "",
  newPasswordVerify: "",
};

export const UpdatePasswordForm = ({ sendToApi }: UpdatePasswordFormProps) => {
  const [signInForm, setSignInForm] =
    useState<UpdatePasswordForm>(defaultValues);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setSignInForm((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleFormSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    sendToApi(signInForm);
  };

  return (
    <form>
      <div>
        <label htmlFor="currentPassword">Mot de passe actuel</label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          onChange={(event) => handleInputChange(event)}
        />
      </div>
      <div>
        <label htmlFor="newPassword">Nouveau mot de passe</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          onChange={(event) => handleInputChange(event)}
        />
      </div>
      <div>
        <label htmlFor="newPasswordVerify">
          Confirmez nouveau mot de passe
        </label>
        <input
          id="newPasswordVerify"
          name="newPasswordVerify"
          type="password"
          onChange={(event) => handleInputChange(event)}
        />
      </div>
      <Button onClick={(event) => handleFormSubmit(event)}>Mettre à jour le mot de passe</Button>
    </form>
  );
};
