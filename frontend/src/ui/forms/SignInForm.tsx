import { Button } from "../components/button/Button";
import { useState, type ChangeEvent } from "react";

export interface SignInForm {
  email: string;
  password: string;
}

interface SignInFormProps {
  sendToApi: (formData: SignInForm) => void;
}

const defaultValues: SignInForm = {
  email: "",
  password: "",
};

export const SignInForm = ({ sendToApi }: SignInFormProps) => {
  const [signInForm, setSignInForm] = useState<SignInForm>(defaultValues);

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
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={(event) => handleInputChange(event)}
        />
      </div>
      <div>
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={(event) => handleInputChange(event)}
        />
      </div>
      <Button onClick={(event) => handleFormSubmit(event)}>Connexion</Button>
    </form>
  );
};
