import { useAuthContext } from "../../core/auth/useAuthContext";
import { useApiFetch } from "../../core/hooks/useApiFetch";
import { UpdatePasswordForm } from "../../ui/forms/UpdatePasswordForm";
import "./profile.scss";

export const Profile = () => {
  const { user } = useAuthContext();
  const { fetchApi, result, isLoading, isError, errorMsg } = useApiFetch();

  const sendToApi = async (formData: UpdatePasswordForm) => {
    await fetchApi({
      method: "PATCH",
      path: "/auth/password-update",
      body: formData,
      credentials: "include",
      delai: 2000,
    });
  };

  return (
    <div className="profile-page">
      <article>
        <h1>Hello {user && user.pseudo}</h1>
        <section>
          {user && (
            <div>
              <p>Email : {user.email}</p>
              <p>
                Enregistré le :{" "}
                {new Date(user.created_at).toLocaleDateString("fr")}
              </p>
            </div>
          )}
        </section>
      </article>
      <article>
        <section>
          <h3>Changez votre mot de passe</h3>
          {isLoading && <div>Chargement...</div>}
          {!isLoading && result && (
            <p className="success">
              <strong>{result.message}</strong>
            </p>
          )}
          {!isLoading && isError && (
            <p className="error">
              <strong>{errorMsg}</strong>
            </p>
          )}
          {!isLoading && <UpdatePasswordForm sendToApi={sendToApi} />}
        </section>
      </article>
    </div>
  );
};
