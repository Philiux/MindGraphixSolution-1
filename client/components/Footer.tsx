import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  // Masquer le footer si un administrateur est connecté
  if (isAdmin) {
    return null;
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    // Simulation d'inscription
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("Merci pour votre inscription à notre newsletter !");
    setEmail("");
    setIsSubscribing(false);
  };

  const footerLinks = {
    services: [
      "Design Graphique",
      "Développement Web",
      "UI/UX Design",
      "Motion Design",
      "E-commerce",
      "Marketing Digital",
    ],
    company: [
      "À propos",
      "Notre équipe",
      "Nos valeurs",
      "Carrières",
      "Témoignages",
      "Blog",
    ],
    support: [
      "Centre d'aide",
      "Documentation",
      "Support technique",
      "Politique de confidentialité",
      "Conditions d'utilisation",
      "FAQ",
    ],
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    {
      icon: Twitter,
      href: "#",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-600",
    },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:text-blue-700",
    },
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-gray-900" },
  ];

  const handleNavigation = (href: string) => {
    if (location.pathname !== "/") {
      navigate("/" + href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4">
              Restez connecté avec nous
            </h3>
            <p className="text-xl text-white/90 mb-8">
              Recevez nos dernières actualités, conseils et offres spéciales
              directement dans votre boîte mail
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row max-w-md mx-auto gap-4"
            >
              <div className="relative flex-1">
                <Mail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubscribing}
                className="bg-accent text-black px-8 py-4 rounded-full font-semibold hover:bg-orange-400 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isSubscribing ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} />
                    <span>S'abonner</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F4871d4fcbac047999c8a4dbe551aa7ef%2Faa0f68d60ade45f69d38a41cc2d1e34f?format=webp&width=800"
                  alt="Mind Graphix Solution Logo"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-2xl font-bold">
                  Mind <span className="text-accent">Graphix</span> Solution
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Nous sommes spécialisés dans le design graphique et le
                développement web, dédiés à transformer vos idées en solutions
                digitales impactantes.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-gray-400">
                  <MapPin
                    size={18}
                    className="text-accent flex-shrink-0 mt-1"
                  />
                  <span className="leading-relaxed">
                    Bobo-Dioulasso, Sect N°4
                  </span>
                </div>
                <div className="flex items-start space-x-3 text-gray-400">
                  <Phone size={18} className="text-accent flex-shrink-0 mt-1" />
                  <a
                    href="tel:+22654191605"
                    className="hover:text-accent transition-colors leading-relaxed font-medium"
                  >
                    +226 54191605
                  </a>
                </div>
                <div className="flex items-start space-x-3 text-gray-400">
                  <Mail size={18} className="text-accent flex-shrink-0 mt-1" />
                  <a
                    href="mailto:contact@mindgraphix.com"
                    className="hover:text-accent transition-colors leading-relaxed font-medium break-all"
                  >
                    contact@mindgraphix.com
                  </a>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xl font-bold mb-6 relative">
                Services
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-accent rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((service) => (
                  <li key={service}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-accent transition-colors"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xl font-bold mb-6 relative">
                Entreprise
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-accent rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link}>
                    {link === "À propos" ? (
                      <Link
                        to="/about"
                        className="text-gray-400 hover:text-accent transition-colors"
                      >
                        {link}
                      </Link>
                    ) : link === "Notre équipe" || link === "Carrières" ? (
                      <button
                        onClick={() => handleNavigation("#team")}
                        className="text-gray-400 hover:text-accent transition-colors text-left"
                      >
                        {link}
                      </button>
                    ) : (
                      <button className="text-gray-400 hover:text-accent transition-colors text-left">
                        {link}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xl font-bold mb-6 relative">
                Support
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-accent rounded-full"></div>
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-accent transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6 mb-6 md:mb-0">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110`}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>

              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm">
                  © 2025 Mind Graphix Solution. Tous droits réservés.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Créé avec ❤️ au Burkina Faso
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
