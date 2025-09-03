import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  severity: "error" | "warning" | "success";
}

interface FormValidatorProps {
  value: string;
  rules: ValidationRule[];
  className?: string;
}

export const FormValidator: React.FC<FormValidatorProps> = ({
  value,
  rules,
  className = "",
}) => {
  const getValidationResults = () => {
    return rules.map((rule) => ({
      ...rule,
      passed: rule.test(value),
    }));
  };

  const results = getValidationResults();
  const hasErrors = results.some((r) => r.severity === "error" && !r.passed);
  const hasWarnings = results.some(
    (r) => r.severity === "warning" && !r.passed,
  );

  if (!value) return null;

  return (
    <div className={`mt-2 space-y-1 ${className}`}>
      {results.map((result, index) => {
        const Icon = result.passed
          ? CheckCircle
          : result.severity === "error"
            ? XCircle
            : AlertCircle;

        const colorClass = result.passed
          ? "text-green-600"
          : result.severity === "error"
            ? "text-red-600"
            : "text-yellow-600";

        return (
          <div
            key={index}
            className={`flex items-center space-x-2 text-sm ${colorClass}`}
          >
            <Icon size={14} />
            <span>{result.message}</span>
          </div>
        );
      })}
    </div>
  );
};

// Règles de validation prédéfinies
export const ValidationRules = {
  email: {
    test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: "Format email valide",
    severity: "error" as const,
  },

  phone: {
    test: (value: string) =>
      /^\+\d{1,4}\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/.test(value),
    message: "Format téléphone valide",
    severity: "error" as const,
  },

  passwordStrong: {
    test: (value: string) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        value,
      ),
    message:
      "Mot de passe fort (8+ caractères, majuscule, minuscule, chiffre, caractère spécial)",
    severity: "error" as const,
  },

  passwordMedium: {
    test: (value: string) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(value),
    message:
      "Mot de passe moyen (6+ caractères, majuscule, minuscule, chiffre)",
    severity: "warning" as const,
  },

  required: {
    test: (value: string) => value.trim().length > 0,
    message: "Champ requis",
    severity: "error" as const,
  },

  minLength: (min: number) => ({
    test: (value: string) => value.length >= min,
    message: `Minimum ${min} caractères`,
    severity: "error" as const,
  }),

  maxLength: (max: number) => ({
    test: (value: string) => value.length <= max,
    message: `Maximum ${max} caractères`,
    severity: "warning" as const,
  }),
};
