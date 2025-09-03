import React, { Suspense, lazy, memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

// Lazy loading des composants lourds
export const LazyQuoteManager = lazy(() =>
  import("./QuoteManager").then((module) => ({ default: module.QuoteManager })),
);

export const LazyAdvancedAdminManager = lazy(() =>
  import("./AdvancedAdminManager").then((module) => ({
    default: module.AdvancedAdminManager,
  })),
);

export const LazyRealTimeStats = lazy(() =>
  import("./RealTimeStats").then((module) => ({
    default: module.RealTimeStats,
  })),
);

export const LazyAdvancedStyleManager = lazy(() =>
  import("./AdvancedStyleManager").then((module) => ({
    default: module.AdvancedStyleManager,
  })),
);

// Composant de chargement optimisé
export const LoadingSpinner: React.FC<{ size?: "sm" | "md" | "lg" }> = memo(
  ({ size = "md" }) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
    };

    return (
      <div className="flex items-center justify-center p-4">
        <motion.div
          className={`${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  },
);

LoadingSpinner.displayName = "LoadingSpinner";

// HOC pour le lazy loading avec gestion d'erreur
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode,
) => {
  const LazyComponent = (props: P) => (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );

  LazyComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;
  return LazyComponent;
};

// Hook pour l'optimisation des images
export const useImageOptimization = () => {
  const createOptimizedImageUrl = useCallback(
    (url: string, width?: number, quality = 80) => {
      if (!url) return "";

      // Si c'est une URL locale, pas d'optimisation
      if (url.startsWith("/") || url.startsWith("data:")) {
        return url;
      }

      // Pour les URLs externes, on peut ajouter des paramètres d'optimisation
      const urlObj = new URL(url);
      if (width) urlObj.searchParams.set("w", width.toString());
      urlObj.searchParams.set("q", quality.toString());

      return urlObj.toString();
    },
    [],
  );

  return { createOptimizedImageUrl };
};

// Hook pour la mise en cache des données
export const useCache = <T,>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 300000,
) => {
  const getCachedData = useCallback(async (): Promise<T> => {
    const cached = localStorage.getItem(`cache_${key}`);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        return data;
      }
    }

    const freshData = await fetcher();
    localStorage.setItem(
      `cache_${key}`,
      JSON.stringify({
        data: freshData,
        timestamp: Date.now(),
      }),
    );

    return freshData;
  }, [key, fetcher, ttl]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(`cache_${key}`);
  }, [key]);

  return { getCachedData, clearCache };
};

// Hook pour la détection de la connexion
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

// Hook pour l'optimisation des re-rendus
export const useOptimizedCallback = (
  callback: (...args: any[]) => any,
  deps: React.DependencyList,
) => {
  return useCallback(callback, deps);
};

export const useOptimizedMemo = (
  factory: () => any,
  deps: React.DependencyList,
) => {
  return useMemo(factory, deps);
};

// Composant pour intersection observer (lazy loading d'images)
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
}> = memo(({ src, alt, className = "", width, height, placeholder }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const [error, setError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const { createOptimizedImageUrl } = useImageOptimization();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const optimizedSrc = createOptimizedImageUrl(src, width);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {(!isInView || error) && (
        <div
          className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${className}`}
          style={{ width, height }}
        >
          {error ? (
            <span className="text-gray-400 text-sm">Erreur de chargement</span>
          ) : placeholder ? (
            <img
              src={placeholder}
              alt=""
              className="w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
          )}
        </div>
      )}

      {isInView && !error && (
        <motion.img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
});

LazyImage.displayName = "LazyImage";

// Service Worker pour le cache hors ligne
export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
};

// Notification hors ligne
export const OfflineNotification: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showOfflineNotification, setShowOfflineNotification] =
    React.useState(false);

  React.useEffect(() => {
    if (!isOnline) {
      setShowOfflineNotification(true);
    } else {
      // Masquer après 3 secondes quand on revient en ligne
      const timer = setTimeout(() => {
        setShowOfflineNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showOfflineNotification) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        isOnline ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
      }`}
    >
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full ${isOnline ? "bg-white" : "bg-red-500"}`}
        />
        <span className="font-medium">
          {isOnline
            ? "Connexion rétablie !"
            : "Mode hors ligne - Fonctionnalités limitées"}
        </span>
      </div>
    </motion.div>
  );
};

// Hook pour précharger les routes
export const useRoutePreloading = () => {
  const preloadRoute = useCallback((routePath: string) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = routePath;
    document.head.appendChild(link);
  }, []);

  return { preloadRoute };
};
