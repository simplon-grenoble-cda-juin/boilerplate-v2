import "./signUp.scss";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../core/auth/useAuthContext";
import { useApiFetch } from "../../core/hooks/useApiFetch";
import type { User } from "../../types/Types";
import { SignUpForm } from "../../ui/forms/SignUpForm";

export const SignUp = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const { fetchApi, isLoading, isError, errorMsg } = useApiFetch<User>();

  const sendToApi = async (formData: SignUpForm) => {
    const response = await fetchApi({
      method: "POST",
      path: "/auth/signup",
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
    <main className="signup-page">
      <h1>Inscription</h1>
      {isLoading && <p>Chargement</p>}
      {isError && (
        <p className="error">
          <strong>{errorMsg}</strong>
        </p>
      )}
      {!isLoading && <SignUpForm sendToApi={sendToApi} />}
    </main>
  );
};
