import React from "react";
import { Github, Linkedin, Twitter, Globe } from "lucide-react";
import { EditableImage } from "./EditableImage";
import { EditableText } from "./EditableText";

export const Team: React.FC = () => {
  const teamMembers = [
    {
      name: "Badior OUATTARA",
      role: "PROGRAMMEUR & GRAPHISTE",
      image:
        "https://images.pexels.com/photos/17794196/pexels-photo-17794196.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
      bio: "Expert en développement full-stack et design graphique avec plus de 5 ans d'expérience.",
      skills: ["React", "Node.js", "Photoshop", "Illustrator"],
      social: {
        linkedin: "#",
        github: "#",
        dribbble: "#",
      },
    },
    {
      name: "FAÏZ PHILLIPPE SANON",
      role: "Développeur Full-Stack",
      image:
        "https://images.pexels.com/photos/5952738/pexels-photo-5952738.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
      bio: "Spécialisé dans les technologies modernes et l'architecture scalable des applications.",
      skills: ["TypeScript", "Python", "AWS", "Docker"],
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
      },
    },
    {
      name: "Émilie Rousseau",
      role: "UX/UI Designer",
      image:
        "https://images.pexels.com/photos/7552359/pexels-photo-7552359.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
      bio: "Passionnée par la création d'expériences utilisateur exceptionnelles et intuitives.",
      skills: ["Figma", "Sketch", "Prototyping", "User Research"],
      social: {
        linkedin: "#",
        dribbble: "#",
        behance: "#",
      },
    },
    {
      name: "Antoine Morel",
      role: "Motion Designer",
      image:
        "https://images.pexels.com/photos/3379937/pexels-photo-3379937.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
      bio: "Créateur d'animations captivantes et de contenus vidéo pour le marketing digital.",
      skills: ["After Effects", "Cinema 4D", "Premiere", "Blender"],
      social: {
        linkedin: "#",
        behance: "#",
        vimeo: "#",
      },
    },
  ];

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return Linkedin;
      case "github":
        return Github;
      case "twitter":
        return Twitter;
      case "dribbble":
        return Globe;
      case "behance":
        return Globe;
      case "vimeo":
        return Globe;
      default:
        return Globe;
    }
  };

  return (
    <section
      id="team"
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 relative inline-block">
            Notre Équipe
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-accent rounded-full"></div>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Rencontrez les talents créatifs et techniques derrière Mind Graphix
            Solution
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image container */}
              <div className="relative h-64 overflow-hidden">
                <EditableImage
                  contentKey={`team.member.${index}.image`}
                  defaultSrc={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Social links overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  <div className="flex space-x-3">
                    {Object.entries(member.social).map(([platform, url]) => {
                      const Icon = getSocialIcon(platform);
                      return (
                        <a
                          key={platform}
                          href={url}
                          className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-accent hover:text-black transition-all duration-300 transform hover:scale-110 border border-white/30"
                        >
                          <Icon size={18} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <EditableText
                  contentKey={`team.member.${index}.name`}
                  defaultValue={member.name}
                  as="h3"
                  className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors"
                />
                <EditableText
                  contentKey={`team.member.${index}.role`}
                  defaultValue={member.role}
                  as="p"
                  className="text-primary font-semibold mb-3 text-sm uppercase tracking-wide"
                />
                <EditableText
                  contentKey={`team.member.${index}.bio`}
                  defaultValue={member.bio}
                  as="p"
                  className="text-gray-600 text-sm leading-relaxed mb-4"
                  multiline
                />

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {member.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-accent/20 to-transparent rounded-full opacity-50" />
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-primary/20 to-transparent rounded-full opacity-30" />
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-block bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              Rejoignez notre équipe !
            </h3>
            <p className="mb-6 opacity-90">
              Nous recherchons toujours de nouveaux talents passionnés pour
              renforcer notre équipe créative.
            </p>
            <button className="bg-accent text-black px-8 py-3 rounded-full font-semibold hover:bg-orange-400 transform hover:scale-105 transition-all duration-300">
              Voir les offres d'emploi
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
