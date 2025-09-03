import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { ClientNotifications } from "./ClientNotifications";
import { SimpleThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationSystem";

interface HeaderProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoginClick,
  onRegisterClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, currentUser, isAdmin, isSuperAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Accueil", href: "/", type: "route" },
    { label: "À propos", href: "/about", type: "route" },
    { label: "Services", href: "/services", type: "route" },
    { label: "Portfolio", href: "#portfolio", type: "scroll" },
    { label: "Équipe", href: "#team", type: "scroll" },
    { label: "Contact", href: "#contact", type: "scroll" },
  ];

  const handleNavigation = (item: any) => {
    if (item.type === "scroll") {
      // Si on n'est pas sur la page d'accueil, rediriger vers l'accueil avec l'ancre
      if (location.pathname !== "/") {
        navigate("/" + item.href);
      } else {
        // Si on est sur la page d'accueil, faire le scroll normal
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center space-x-2 text-xl font-bold transition-colors flex-shrink-0 ${
              isScrolled ? "text-primary" : "text-white"
            }`}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F4871d4fcbac047999c8a4dbe551aa7ef%2Faa0f68d60ade45f69d38a41cc2d1e34f?format=webp&width=800"
              alt="Mind Graphix Solution Logo"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <span className="whitespace-nowrap flex items-center">
              Mind&nbsp;<span className="text-accent">Graphix</span>
              &nbsp;Solution
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.type === "route" ? (
                  <Link
                    to={item.href}
                    className={`relative font-medium transition-colors hover:text-accent group ${
                      isScrolled ? "text-gray-700" : "text-white"
                    }`}
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`relative font-medium transition-colors hover:text-accent group ${
                      isScrolled ? "text-gray-700" : "text-white"
                    }`}
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Auth Buttons / User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
            <NotificationBell />
            <SimpleThemeToggle />
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <ClientNotifications />

                {!isAdmin && !isSuperAdmin && (
                  <a
                    href="/client-dashboard"
                    className={`hidden xl:flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                      isScrolled
                        ? "text-primary hover:bg-primary/10"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <User size={14} />
                    <span className="text-sm font-medium">Dashboard</span>
                  </a>
                )}

                <div
                  className={`hidden lg:flex items-center space-x-1 ${isScrolled ? "text-gray-700" : "text-white"}`}
                >
                  <User size={16} />
                  <span className="text-sm font-medium">
                    {isSuperAdmin
                      ? "Admin"
                      : isAdmin
                        ? "Admin"
                        : currentUser?.name?.split(" ")[0] || "User"}
                  </span>
                </div>
                {isAdmin && (
                  <Button
                    onClick={() => navigate("/admin")}
                    variant="outline"
                    size="sm"
                    className={`border-2 transition-all text-xs px-3 py-1 ${
                      isScrolled
                        ? "border-primary text-primary hover:bg-primary hover:text-white"
                        : "border-white text-white hover:bg-white hover:text-primary"
                    }`}
                  >
                    Admin
                  </Button>
                )}
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className={`border-2 transition-all text-xs px-2 py-1 ${
                    isScrolled
                      ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      : "border-white text-white hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <LogOut size={14} />
                  <span className="hidden lg:inline ml-1">Déconnexion</span>
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onLoginClick}
                  className={`border-2 transition-all ${
                    isScrolled
                      ? "border-primary text-primary hover:bg-primary hover:text-white"
                      : "border-white text-white hover:bg-white hover:text-primary"
                  }`}
                >
                  Connexion
                </Button>
                <Button
                  onClick={onRegisterClick}
                  className="bg-gradient-to-r from-accent to-orange-400 text-black font-semibold hover:from-orange-400 hover:to-accent transform hover:scale-105 transition-all"
                >
                  Inscription
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? "text-primary" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200">
            <div className="container mx-auto px-6 py-6">
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.label}>
                    {item.type === "route" ? (
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-left text-gray-700 font-medium py-2 transition-colors hover:text-accent"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleNavigation(item)}
                        className="block w-full text-left text-gray-700 font-medium py-2 transition-colors hover:text-accent"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col space-y-3 mt-6">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center space-x-2 text-gray-700 p-2">
                      <User size={20} />
                      <span className="font-medium">
                        {isSuperAdmin
                          ? "Utilisateur"
                          : isAdmin
                            ? "Admin"
                            : currentUser?.name || "Utilisateur"}
                      </span>
                    </div>
                    {isAdmin && (
                      <Button
                        onClick={() => {
                          navigate("/admin");
                          setIsMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        Vue Admin
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <LogOut size={16} className="mr-2" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onLoginClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Connexion
                    </Button>
                    <Button
                      onClick={() => {
                        onRegisterClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-accent to-orange-400 text-black font-semibold hover:from-orange-400 hover:to-accent"
                    >
                      Inscription
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
