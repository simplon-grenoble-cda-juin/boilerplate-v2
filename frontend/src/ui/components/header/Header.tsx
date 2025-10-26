import "./header.scss";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import clsx from "clsx";
import { Button } from "../button/Button";
import { useAuthContext } from "../../../core/auth/useAuthContext";

type NavLinkItem = {
  label: string;
  url: string;
};

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const { user, handleLogOut } = useAuthContext();

  const publicNavLinks: NavLinkItem[] = [
    { label: "Connexion", url: "/connexion" },
    { label: "Inscription", url: "/inscription" },
  ];

  const privateNavLinks: NavLinkItem[] = [{ label: "Profil", url: "/profil" }];

  const handleNavigation = (link: NavLinkItem) => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    return navigate(link.url);
  };

  return (
    <div className="navigation">
      <div className="navigation--top">
        <Link to="/">BoilerPlate</Link>
        <nav
          className={clsx("navigation--top__list", {
            "navigation--top__list--mobile": isMobileMenuOpen,
          })}
        >
          <ul className="navigation--top__list__nav">
            {!user &&
              publicNavLinks.map((link) => (
                <li key={link.url}>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation(link)}
                  >
                    {link.label}
                  </Button>
                </li>
              ))}
            {user && (
              <>
                {privateNavLinks.map((link) => (
                  <li key={link.url}>
                    <Button
                      variant="ghost"
                      onClick={() => handleNavigation(link)}
                    >
                      {link.label}
                    </Button>
                  </li>
                ))}
                <li>
                  <Button variant="ghost" onClick={() => handleLogOut()}>
                    Déconnexion
                  </Button>
                </li>
              </>
            )}
          </ul>
        </nav>
        <Button
          className="navigation--top__mobile_menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "X" : "Menu"}
        </Button>
      </div>
    </div>
  );
};
