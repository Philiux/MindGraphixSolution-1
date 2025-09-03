import React, { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "service";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  schema?: object;
}

const defaultMeta = {
  title: "Mind Graphix Solution - Agence Web & Design Graphique Burkina Faso",
  description:
    "Mind Graphix Solution, votre agence créative à Bobo-Dioulasso. Spécialisée en développement web, design graphique, e-commerce et marketing digital. Solutions digitales sur mesure pour propulser votre entreprise.",
  keywords:
    "agence web, design graphique, développement web, e-commerce, marketing digital, Burkina Faso, Bobo-Dioulasso, site web, logo, identité visuelle",
  image: "https://mindgraphix.com/og-image.jpg",
  url: "https://mindgraphix.com",
  type: "website" as const,
  author: "Mind Graphix Solution",
};

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  schema,
}) => {
  const meta = {
    title: title ? `${title} | Mind Graphix Solution` : defaultMeta.title,
    description: description || defaultMeta.description,
    keywords: keywords || defaultMeta.keywords,
    image: image || defaultMeta.image,
    url: url || defaultMeta.url,
    type,
    author: author || defaultMeta.author,
  };

  const structuredData = schema || {
    "@context": "https://schema.org",
    "@type": type === "article" ? "Article" : "WebPage",
    headline: title || defaultMeta.title,
    description: meta.description,
    image: meta.image,
    url: meta.url,
    author: {
      "@type": "Organization",
      name: meta.author,
    },
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
  };

  useEffect(() => {
    // Update title
    document.title = meta.title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let metaTag = document.querySelector(selector) as HTMLMetaElement;

      if (!metaTag) {
        metaTag = document.createElement("meta");
        if (property) {
          metaTag.setAttribute("property", name);
        } else {
          metaTag.setAttribute("name", name);
        }
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", meta.description);
    updateMetaTag("keywords", meta.keywords);
    updateMetaTag("author", meta.author);

    // Open Graph tags
    updateMetaTag("og:title", meta.title, true);
    updateMetaTag("og:description", meta.description, true);
    updateMetaTag("og:type", meta.type, true);
    updateMetaTag("og:url", meta.url, true);
    updateMetaTag("og:image", meta.image, true);
    updateMetaTag("og:locale", "fr_FR", true);
    updateMetaTag("og:site_name", "Mind Graphix Solution", true);

    // Twitter tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", meta.title);
    updateMetaTag("twitter:description", meta.description);
    updateMetaTag("twitter:image", meta.image);

    // Article-specific tags
    if (type === "article" && publishedTime) {
      updateMetaTag("article:published_time", publishedTime, true);
    }
    if (type === "article" && modifiedTime) {
      updateMetaTag("article:modified_time", modifiedTime, true);
    }
    if (type === "article" && author) {
      updateMetaTag("article:author", author, true);
    }

    // Update canonical URL
    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = meta.url;

    // Update structured data
    let structuredDataScript = document.querySelector(
      'script[type="application/ld+json"]',
    );
    if (!structuredDataScript) {
      structuredDataScript = document.createElement("script");
      (structuredDataScript as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);
  }, [meta, type, publishedTime, modifiedTime, author, structuredData]);

  return null;
};

// Composants SEO spécialisés pour chaque page
export const HomePageSEO: React.FC = () => (
  <SEOHead
    title="Accueil"
    description="Mind Graphix Solution - Votre partenaire créatif pour tous vos projets digitaux. Design moderne, développement web professionnel et stratégies marketing qui propulsent votre entreprise vers le succès."
    schema={{
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Mind Graphix Solution",
      url: "https://mindgraphix.com",
      logo: "https://mindgraphix.com/logo.png",
      description:
        "Agence créative spécialisée en développement web, design graphique et marketing digital",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Secteur N°4",
        addressLocality: "Bobo-Dioulasso",
        addressCountry: "BF",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+226-54191605",
        contactType: "customer service",
        email: "contact@mindgraphix.com",
      },
    }}
  />
);

export const AboutPageSEO: React.FC = () => (
  <SEOHead
    title="À Propos"
    description="Découvrez l'histoire de Mind Graphix Solution, notre mission et notre équipe passionnée. Plus de 3 ans d'expérience dans la création digitale au Burkina Faso avec 50+ projets réalisés et 100% de satisfaction client."
    url="https://mindgraphix.com/about"
    schema={{
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "À Propos de Mind Graphix Solution",
      description: "Histoire, mission et équipe de Mind Graphix Solution",
      mainEntity: {
        "@type": "Organization",
        name: "Mind Graphix Solution",
        foundingDate: "2021",
        numberOfEmployees: "5-10",
        description: "Agence créative spécialisée en solutions digitales",
      },
    }}
  />
);

export const ServicesPageSEO: React.FC = () => (
  <SEOHead
    title="Nos Services"
    description="Services professionnels de Mind Graphix Solution : Développement Web (sites vitrine, e-commerce), Design Graphique (logos, identité visuelle), UI/UX Design, Motion Design et Marketing Digital. Devis gratuit."
    keywords="services web, développement site internet, création logo, design graphique, e-commerce, marketing digital, Burkina Faso"
    url="https://mindgraphix.com/services"
    schema={{
      "@context": "https://schema.org",
      "@type": "Service",
      provider: {
        "@type": "Organization",
        name: "Mind Graphix Solution",
      },
      serviceType: "Digital Agency Services",
      description: "Services complets de création digitale",
      offers: [
        {
          "@type": "Offer",
          name: "Développement Web",
          description: "Sites web modernes et responsives",
          priceRange: "525000-2500000 FCFA",
        },
        {
          "@type": "Offer",
          name: "Design Graphique",
          description: "Logos et identité visuelle",
          priceRange: "98000-875000 FCFA",
        },
      ],
    }}
  />
);

export const ClientDashboardSEO: React.FC = () => (
  <SEOHead
    title="Tableau de Bord Client"
    description="Accédez à votre espace client Mind Graphix Solution. Suivez l'avancement de vos projets, communiquez avec notre équipe et accédez à vos fichiers en temps réel."
    url="https://mindgraphix.com/client-dashboard"
    type="website"
  />
);

// Hook pour les métadonnées dynamiques
export const useSEO = () => {
  const updatePageTitle = (title: string) => {
    document.title = `${title} | Mind Graphix Solution`;
  };

  const updateMetaDescription = (description: string) => {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }
  };

  const updateCanonicalUrl = (url: string) => {
    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  };

  return {
    updatePageTitle,
    updateMetaDescription,
    updateCanonicalUrl,
  };
};
