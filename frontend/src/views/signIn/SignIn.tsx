import "./signIn.scss";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../core/auth/useAuthContext";
import { useApiFetch } from "../../core/hooks/useApiFetch";
import type { User } from "../../types/Types";
import { SignInForm } from "../../ui/forms/SignInForm";

export const SignIn = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const { fetchApi, isLoading, isError, errorMsg } = useApiFetch<User>();

  const sendToApi = async (formData: SignInForm) => {
    const response = await fetchApi({
      method: "POST",
      path: "/auth/signin",
      body: formData,
      credentials: "include",
      delai: 2000
    });

    if (response.data) {
      setUser(response.data);
      return navigate("/profil");
    }
  };

  return (
    <main className="signin-page">
      <h1>Connexion</h1>
      {isLoading && <p>Chargement</p>}
      {isError && (
        <p className="error">
          <strong>{errorMsg}</strong>
        </p>
      )}
      {!isLoading && <SignInForm sendToApi={sendToApi} />}
    </main>
  );
};
