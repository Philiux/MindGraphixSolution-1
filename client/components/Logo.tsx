import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
};

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  className = "",
  showText = false,
}) => {
  // Nouveau logo MGS
  const logoUrl =
    "https://cdn.builder.io/api/v1/image/assets%2F7e57108f5e3443f3b4d0dcd4f1011232%2F13155bb720d84e8d89a11eb2916aa8eb?format=webp&width=800";

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img
        src={logoUrl}
        alt="MGS - Mind Graphix Solution Logo"
        className={`${sizeMap[size]} object-contain flex-shrink-0 drop-shadow-lg`}
      />
      {showText && (
        <div className="hidden sm:block">
          <div className="flex items-center">
            <span className="font-bold text-amber-600">Mind</span>
            <span className="font-bold text-amber-500 mx-1">Graphix</span>
            <span className="font-bold text-amber-600">Solution</span>
          </div>
          <div className="text-xs text-gray-600 -mt-1">
            Créativité & Innovation Digitale
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
