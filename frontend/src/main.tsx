import "./ui/index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthContextProvider } from "./core/auth/useAuthContext";
import { Homepage } from "./views/Homepage";
import { SignIn } from "./views/signIn/SignIn";
import { SignUp } from "./views/signUp/SignUp";
import { Profile } from "./views/profile/Profile";
import { Header } from "./ui/components/header/Header";
import { AuthGuard } from "./core/auth/AuthGuard";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <AuthGuard>
          <div className="app">
            <Header />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/connexion" element={<SignIn />} />
              <Route path="/inscription" element={<SignUp />} />
              <Route path="/profil" element={<Profile />} />
            </Routes>
          </div>
        </AuthGuard>
      </BrowserRouter>
    </AuthContextProvider>
  </StrictMode>
);
