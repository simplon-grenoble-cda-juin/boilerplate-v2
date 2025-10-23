import { Button } from "../components/button/Button";
import { useState, type ChangeEvent } from "react";

export interface SignUpForm {
  email: string;
  pseudo: string;
  password: string;
  passwordVerify: string;
}

interface SignInFormProps {
  sendToApi: (formData: SignUpForm) => void;
}

const defaultValues: SignUpForm = {
  email: "",
  pseudo: "",
  password: "",
  passwordVerify: "",
};

export const SignUpForm = ({ sendToApi }: SignInFormProps) => {
  const [signUpForm, setSignUpForm] = useState<SignUpForm>(defaultValues);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setSignUpForm((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleFormSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    sendToApi(signUpForm);
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
        <label htmlFor="pseudo">Peudo</label>
        <input
          id="pseudo"
          name="pseudo"
          type="text"
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
      <div>
        <label htmlFor="password_verify">Confirmez le mot de passe</label>
        <input
          id="password-verify"
          name="passwordVerify"
          type="password"
          onChange={(event) => handleInputChange(event)}
        />
      </div>
      <Button onClick={(event) => handleFormSubmit(event)}>Inscription</Button>
    </form>
  );
};
