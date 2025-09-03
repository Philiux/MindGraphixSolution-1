import React from "react";
import { Lightbulb, Code, TrendingUp, Headphones } from "lucide-react";
import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";
import { ModernCard, GradientText } from "./ModernVisualEffects";
import { motion } from "framer-motion";

export const About: React.FC = () => {
  const features = [
    {
      icon: Lightbulb,
      title: "Design Innovant",
      description: "Des concepts uniques qui captivent votre audience",
    },
    {
      icon: Code,
      title: "Développement Solide",
      description: "Des solutions techniques robustes et évolutives",
    },
    {
      icon: TrendingUp,
      title: "Stratégie Digitale",
      description: "Une approche orientée résultats pour votre business",
    },
    {
      icon: Headphones,
      title: "Support Premium",
      description: "Un accompagnement personnalisé à chaque étape",
    },
  ];

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-background to-background/50 relative overflow-hidden"
    >
      {/* Effets de fond */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-primary to-secondary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-accent to-primary rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative inline-block">
            <GradientText>À Propos de Nous</GradientText>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-accent to-primary rounded-full"></div>
          </h2>
          <p className="text-foreground/70 text-lg max-w-3xl mx-auto font-medium">
            Découvrez l'esprit innovant derrière Mind Graphix Solution
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Image avec effet moderne */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500 opacity-80"></div>
            <ModernCard className="relative p-3 transform group-hover:-translate-y-2 transition-all duration-500">
              <EditableImage
                contentKey="about.team.image"
                defaultSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Notre équipe"
                className="w-full h-80 object-cover rounded-2xl"
              />
            </ModernCard>
            <motion.div
              className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center shadow-2xl"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-2xl font-bold text-white drop-shadow-lg">
                3+
              </span>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div>
              <h3 className="text-3xl font-bold mb-6">
                <GradientText>
                  Créativité & Technologie au Service de Votre Succès
                </GradientText>
              </h3>
              <div className="space-y-4 text-foreground/70 leading-relaxed font-medium">
                <p>
                  Mind Graphix Solution est spécialisée dans la{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                    création graphique
                  </span>{" "}
                  et le{" "}
                  <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent font-bold">
                    développement web
                  </span>{" "}
                  sur mesure. Notre mission est de transformer vos idées en
                  solutions digitales impactantes.
                </p>
                <p>
                  Nous croyons en une approche holistique qui combine
                  esthétique, fonctionnalité et expérience utilisateur pour
                  créer des produits qui non seulement impressionnent
                  visuellement mais qui délivrent également des{" "}
                  <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent font-bold">
                    résultats concrets
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ModernCard
                    className="group p-6 hover:scale-105 transition-all duration-300"
                    glowEffect={true}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </ModernCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
