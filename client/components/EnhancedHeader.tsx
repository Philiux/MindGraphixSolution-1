import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  LogOut,
  Shield,
  Crown,
  Star,
  Bell,
  Settings,
  Eye,
  ChevronDown,
  Home,
  Info,
  Briefcase,
  FolderOpen,
  Users,
  Mail,
  FileText,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { SimpleThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationSystem";
import Logo from "./Logo";

interface EnhancedHeaderProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({
  onLoginClick,
  onRegisterClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoggedIn,
    currentUser,
    isAdmin,
    isSuperAdmin,
    isMindAdmin,
    logout,
  } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer les menus quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setIsMobileMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const baseNavItems = [
    {
      label: "Accueil",
      href: "/",
      type: "route",
      icon: Home,
      description: "Page d'accueil Mind Graphix",
    },
    {
      label: "À propos",
      href: "/about",
      type: "route",
      icon: Info,
      description: "Notre histoire et expertise",
    },
    {
      label: "Services",
      href: "/services",
      type: "route",
      icon: Briefcase,
      description: "Nos solutions créatives",
    },
    {
      label: "Devis",
      href: "/demande-devis",
      type: "route",
      icon: FileText,
      description: "Demander un devis gratuit",
    },
    {
      label: "Portfolio",
      href: "#portfolio",
      type: "scroll",
      icon: FolderOpen,
      description: "Nos réalisations",
    },
    {
      label: "Équipe",
      href: "#team",
      type: "scroll",
      icon: Users,
      description: "Notre équipe d'experts",
    },
    {
      label: "Contact",
      href: "#contact",
      type: "scroll",
      icon: Mail,
      description: "Nous contacter",
    },
  ];

  // Ajouter les liens selon le niveau d'accès
  const navItems = (() => {
    if (!isLoggedIn) return baseNavItems;

    // Pour les administrateurs
    if (isAdmin) {
      return [
        ...baseNavItems,
        {
          label: "Dashboard Admin",
          href: "/admin",
          type: "route",
          icon: Settings,
          description: "Tableau de bord administrateur",
        },
        {
          label: "Gestion Devis",
          href: "/admin/quotes",
          type: "route",
          icon: FileText,
          description: "Gestion des devis",
        },
      ];
    }

    // Pour les utilisateurs simples
    return [
      ...baseNavItems,
      {
        label: "Mon Espace",
        href: "/client-dashboard",
        type: "route",
        icon: User,
        description: "Mon espace personnel",
      },
      {
        label: "Mes Demandes",
        href: "/mes-devis",
        type: "route",
        icon: FileText,
        description: "Mes demandes de devis",
      },
    ];
  })();

  const handleNavigation = (item: any, event: React.MouseEvent) => {
    event.stopPropagation();

    if (item.type === "scroll") {
      if (location.pathname !== "/") {
        navigate("/" + item.href);
      } else {
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  const getUserLevel = () => {
    if (isMindAdmin)
      return {
        label: "Mind Admin",
        icon: Crown,
        color: "text-yellow-600 bg-yellow-100",
        gradient: "from-yellow-500 to-orange-500",
      };
    if (isSuperAdmin)
      return {
        label: "Super Admin",
        icon: Shield,
        color: "text-blue-600 bg-blue-100",
        gradient: "from-blue-500 to-indigo-500",
      };
    if (isAdmin)
      return {
        label: "Admin",
        icon: Star,
        color: "text-green-600 bg-green-100",
        gradient: "from-green-500 to-emerald-500",
      };
    return {
      label: "Utilisateur",
      icon: User,
      color: "text-gray-600 bg-gray-100",
      gradient: "from-gray-500 to-slate-500",
    };
  };

  const userLevel = getUserLevel();

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg py-3"
          : "bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto pl-2 pr-4">
        <nav className="flex items-center justify-between gap-4">
          {/* Logo amélioré */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mr-8"
          >
            <Link
              to="/"
              className={`transition-colors flex-shrink-0 ${
                isScrolled ? "text-primary" : "text-white"
              }`}
            >
              <Logo size="md" showText={true} />
            </Link>
          </motion.div>

          {/* Navigation desktop améliorée */}
          <div className="hidden lg:flex items-center space-x-0 flex-1 justify-center">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {item.type === "route" ? (
                  <Link
                    to={item.href}
                    className={`relative flex items-center space-x-1 px-3 py-2 rounded-full font-medium transition-all hover:bg-white/10 group ${
                      isScrolled
                        ? "text-gray-700 hover:text-primary"
                        : "text-white hover:text-accent"
                    }`}
                  >
                    <item.icon size={16} />
                    <span className="whitespace-nowrap">{item.label}</span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></div>
                  </Link>
                ) : (
                  <button
                    onClick={(e) => handleNavigation(item, e)}
                    className={`relative flex items-center space-x-1 px-3 py-2 rounded-full font-medium transition-all hover:bg-white/10 group ${
                      isScrolled
                        ? "text-gray-700 hover:text-primary"
                        : "text-white hover:text-accent"
                    }`}
                  >
                    <item.icon size={16} />
                    <span className="whitespace-nowrap">{item.label}</span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></div>
                  </button>
                )}

                {/* Tooltip au survol */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg border border-gray-700 z-50">
                  {item.description}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Section utilisateur améliorée */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <NotificationBell />
            <SimpleThemeToggle />

            {isLoggedIn ? (
              <div className="relative">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all hover:bg-white/10 ${
                    isScrolled ? "text-gray-700" : "text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${userLevel.gradient} flex items-center justify-center text-white shadow-lg`}
                  >
                    <userLevel.icon size={20} />
                  </div>

                  <div className="hidden xl:block text-left">
                    <div className="font-semibold text-sm">
                      {currentUser?.name?.split(" ")[0] || "Utilisateur"}
                    </div>
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full ${userLevel.color}`}
                    >
                      {userLevel.label}
                    </div>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                  />
                </motion.button>

                {/* Menu utilisateur */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Info utilisateur */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-r ${userLevel.gradient} flex items-center justify-center text-white`}
                          >
                            <userLevel.icon size={24} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {currentUser?.name || "Utilisateur"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {currentUser?.email}
                            </div>
                            <div
                              className={`text-xs px-2 py-1 rounded-full mt-1 ${userLevel.color}`}
                            >
                              {userLevel.label}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu actions */}
                      <div className="py-2">
                        {isAdmin ? (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Settings size={16} />
                            <span>Dashboard Admin</span>
                          </Link>
                        ) : (
                          <Link
                            to="/client-dashboard"
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <User size={16} />
                            <span>Mon Espace</span>
                          </Link>
                        )}

                        <button className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors w-full">
                          <Eye size={16} />
                          <span>Profil</span>
                        </button>

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={logout}
                            className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
                          >
                            <LogOut size={16} />
                            <span>Déconnexion</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <Button
                  variant="outline"
                  onClick={onLoginClick}
                  size="sm"
                  className={`border-2 transition-all whitespace-nowrap shrink-0 ${
                    isScrolled
                      ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      : "border-white text-white hover:bg-white hover:text-primary"
                  }`}
                >
                  Connexion
                </Button>

                <Button
                  onClick={onRegisterClick}
                  size="sm"
                  className={`font-semibold transform hover:scale-105 transition-all shadow-lg whitespace-nowrap shrink-0 px-4 ${
                    isScrolled
                      ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-secondary hover:to-accent"
                      : "bg-gradient-to-r from-accent to-primary text-primary-foreground hover:from-primary hover:to-accent"
                  }`}
                >
                  Inscription
                </Button>
              </div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className={`lg:hidden p-3 rounded-full transition-colors ${
              isScrolled
                ? "text-primary hover:bg-gray-100"
                : "text-white hover:bg-white/20"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>

        {/* Menu mobile amélioré */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-xl border-t border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container mx-auto px-6 py-6">
                <div className="grid gap-4">
                  {/* Navigation mobile */}
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {item.type === "route" ? (
                        <Link
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 p-3 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <item.icon size={20} />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-500">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <button
                          onClick={(e) => handleNavigation(item, e)}
                          className="flex items-center space-x-3 p-3 rounded-full text-gray-700 hover:bg-gray-100 transition-colors w-full text-left"
                        >
                          <item.icon size={20} />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-500">
                              {item.description}
                            </div>
                          </div>
                        </button>
                      )}
                    </motion.div>
                  ))}

                  {/* Section utilisateur mobile */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    {isLoggedIn ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-r ${userLevel.gradient} flex items-center justify-center text-white`}
                          >
                            <userLevel.icon size={24} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {currentUser?.name || "Utilisateur"}
                            </div>
                            <div
                              className={`text-xs px-2 py-1 rounded-full ${userLevel.color}`}
                            >
                              {userLevel.label}
                            </div>
                          </div>
                        </div>

                        {isAdmin ? (
                          <Button
                            onClick={() => {
                              navigate("/admin");
                              setIsMobileMenuOpen(false);
                            }}
                            variant="outline"
                            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          >
                            <Settings size={16} className="mr-2" />
                            Administration
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              navigate("/client-dashboard");
                              setIsMobileMenuOpen(false);
                            }}
                            variant="outline"
                            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          >
                            <User size={16} className="mr-2" />
                            Mon Espace
                          </Button>
                        )}

                        <Button
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <LogOut size={16} className="mr-2" />
                          Déconnexion
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            onLoginClick?.();
                            setIsMobileMenuOpen(false);
                          }}
                          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          Connexion
                        </Button>
                        <Button
                          onClick={() => {
                            onRegisterClick?.();
                            setIsMobileMenuOpen(false);
                          }}
                          className="bg-gradient-to-r from-accent to-primary text-primary-foreground font-semibold hover:from-primary hover:to-secondary"
                        >
                          Inscription
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
